"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpending = exports.getCustomerByAddress = exports.AddAddress = exports.getVerifiedCustomers = exports.deleteCustomer = exports.updateProfile = exports.getAllCustomers = void 0;
const customerModel_1 = require("../models/customerModel");
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("../middleware/errorHandler");
const addressModel_1 = require("../models/addressModel");
const mongodb_1 = require("mongodb");
const getAllCustomers = async (req, res, next) => {
    try {
        var perPage = 5;
        var page = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, customers] = await Promise.all([
            customerModel_1.Customer.countDocuments(),
            customerModel_1.Customer.find()
                .limit(perPage)
                .skip(perPage * page)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, customers });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error getting customers, please try again'));
    }
};
exports.getAllCustomers = getAllCustomers;
const updateProfile = async (req, res, next) => {
    let { email, name, image, phone } = req.body;
    try {
        await customerModel_1.Customer.findOneAndUpdate({ _id: req.params.id }, {
            $set: { email, name, image, phone },
        });
        return res.status(http_status_codes_1.StatusCodes.OK).send({ message: 'Profile updated successfully' });
    }
    catch (err) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating Profile'));
    }
};
exports.updateProfile = updateProfile;
const deleteCustomer = async (req, res, next) => {
    try {
        const id = new mongodb_1.ObjectId(req.params.id);
        const customer = await customerModel_1.Customer.deleteOne(id);
        console.log(customer);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ message: 'Customer deleted successfully' });
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting customer'));
    }
};
exports.deleteCustomer = deleteCustomer;
const getVerifiedCustomers = async (req, res, next) => {
    try {
        const len = await customerModel_1.Customer.find({ verified: true });
        const verifiedCustomers = len.length;
        const count = await customerModel_1.Customer.find();
        const unVerifiedCustomers = count.length - verifiedCustomers;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ verifiedCustomers, unVerifiedCustomers });
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error getting active customers'));
    }
};
exports.getVerifiedCustomers = getVerifiedCustomers;
const AddAddress = async (req, res, next) => {
    try {
        const { city, country, state, zipCode, line1, line2, customerEmail } = req.body;
        const address = await addressModel_1.Address.findOneAndUpdate({ customerEmail }, { city, country, state, zipCode, line1, line2, customerEmail }, { upsert: true, new: true });
        const addressId = address._id;
        await customerModel_1.Customer.findOneAndUpdate(customerEmail, { addressId });
        return res.status(http_status_codes_1.StatusCodes.OK).send(address);
    }
    catch (error) {
        console.log(error);
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};
exports.AddAddress = AddAddress;
const getCustomerByAddress = async (req, res, next) => {
    try {
        const { email } = req.params;
        const address = await addressModel_1.Address.find({ customerEmail: email });
        return res.status(http_status_codes_1.StatusCodes.OK).send({ address });
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};
exports.getCustomerByAddress = getCustomerByAddress;
const updateSpending = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { spend } = req.body;
        const c = await customerModel_1.Customer.updateOne({ id }, { $inc: { spend } }, { new: true });
        console.log(c);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ message: 'spend updated successfully' });
    }
    catch (error) {
        next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};
exports.updateSpending = updateSpending;
