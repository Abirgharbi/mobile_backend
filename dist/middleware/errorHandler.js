"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.AppError = AppError;
class CustomError extends AppError {
    constructor(statusCode, message) {
        super(statusCode, message);
    }
}
exports.CustomError = CustomError;
