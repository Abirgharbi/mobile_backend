"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAuth = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("./errorHandler");
// prevent user from signin/singup while logged in
const protectAuth = async (req, res, next) => {
    // get jwt
    const token = req.cookies.jwt;
    if (token) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'you are already signed in'));
    }
    next();
};
exports.protectAuth = protectAuth;
