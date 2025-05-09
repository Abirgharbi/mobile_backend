"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthLogin = exports.OauthRegister = exports.register = exports.verifyMagicLink = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerModel_1 = require("../models/customerModel");
const sendMagicLink_1 = require("../utils/sendMagicLink");
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("../middleware/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = async (req, res, next) => {
    try {
        let { email } = req.body;
        console.log(email);
        const customer = await customerModel_1.Customer.findOne({ email });
        if (!customer) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({
                message: "Please create an account.",
            });
        }
        if (!customer.verified) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({
                message: "Verify your Account.",
            });
        }
        const magicToken = (0, customerModel_1.generateAuthToken)(email, '1h');
        const link = `?token=${magicToken}`;
        await (0, sendMagicLink_1.sendMagicLink)(email, link, "Click the link below to sign in");
        const token = (0, customerModel_1.generateAuthToken)(email, '30d');
        return res.status(http_status_codes_1.StatusCodes.OK).json({ token, customer });
    }
    catch (error) {
        console.log(error);
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error logging in, please try again'));
    }
};
exports.login = login;
const register = async (req, res, next) => {
    try {
        console.log("abirrr");
        let { email, name } = req.body;
        const magicToken = (0, customerModel_1.generateAuthToken)(email, '1h');
        const exist = await customerModel_1.Customer.findOne({ email });
        const link = `?token=${magicToken}`;
        if (!exist) {
            await (0, sendMagicLink_1.sendMagicLink)(email, link, "Your account has been created. click the link below to confirm your email");
            const customer = await customerModel_1.Customer.create({
                email,
                name,
            });
            const token = (0, customerModel_1.generateAuthToken)(email, '30d');
            return res.status(http_status_codes_1.StatusCodes.OK).json({ token, customer });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ message: "Email already exists" });
        }
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
};
exports.register = register;
const verifyMagicLink = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ message: "token not found" });
        }
        const { jwtSecret } = process.env;
        if (!jwtSecret) {
            throw new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'JWT secret not defined');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token.toString(), jwtSecret);
        const { email } = decodedToken;
        if (await customerModel_1.Customer.findOne({ email })) {
            const customer = await customerModel_1.Customer.findOne({ email });
            if (!customer) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ message: "customer does not exist" });
            }
            else {
                await customerModel_1.Customer.findByIdAndUpdate(customer._id, { verified: true });
                return res.json({ success: true });
            }
        }
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Invalid token'));
    }
};
exports.verifyMagicLink = verifyMagicLink;
const OauthRegister = async (req, res, next) => {
    try {
        let { email, name, image } = req.body;
        const customer = await customerModel_1.Customer.find({ email });
        if (Object.keys(customer).length != 0) {
            const token = (0, customerModel_1.generateAuthToken)(email, '30d');
            return res.status(http_status_codes_1.StatusCodes.OK).send({ token, customer });
        }
        else {
            const customer = await customerModel_1.Customer.create({ email, name, image, verified: true });
            const token = (0, customerModel_1.generateAuthToken)(email, '30d');
            return res.status(http_status_codes_1.StatusCodes.OK).send({ token, customer });
        }
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
};
exports.OauthRegister = OauthRegister;
const OauthLogin = async (req, res, next) => {
    try {
        let { email } = req.body;
        const customer = await customerModel_1.Customer.findOne({ email: email });
        const token = (0, customerModel_1.generateAuthToken)(email, '30d');
        return res.status(http_status_codes_1.StatusCodes.OK).send({ token, customer });
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
};
exports.OauthLogin = OauthLogin;
