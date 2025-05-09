"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.getCategoriesName = exports.getCategories = exports.deleteCategory = exports.updateCategory = exports.addCategory = void 0;
const category_1 = require("../models/category");
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("../middleware/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const addCategory = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { name, image } = req.body;
//         const category = await Category.create({
//             name, image
//         });
//         return res.status(StatusCodes.OK).send(category);
//     } catch (error) {
//         return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
//     }
// }
//new
const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Image is required.' });
        }
        const imagePath = `/uploads/${file.filename}`;
        const category = await category_1.Category.create({
            name,
            image: imagePath
        });
        return res.status(http_status_codes_1.StatusCodes.OK).send(category);
    }
    catch (error) {
        console.error(error);
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.addCategory = addCategory;
const updateCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body;
        const category = await category_1.Category.findByIdAndUpdate(req.params.id, {
            name, image
        }, { new: true });
        return res.status(http_status_codes_1.StatusCodes.OK).send(category);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const category = await category_1.Category.findByIdAndDelete(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).send(category);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.deleteCategory = deleteCategory;
const getCategories = async (req, res, next) => {
    try {
        var perPage = 5;
        var page = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, categories] = await Promise.all([
            category_1.Category.countDocuments(),
            category_1.Category.find()
                .sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, categories });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getCategories = getCategories;
// getCategoriesName
const getCategoriesName = async (req, res, next) => {
    try {
        const categories = await category_1.Category.find().select('name -_id').exec();
        const categoryNames = categories.map(category => category.name);
        return res.status(http_status_codes_1.StatusCodes.OK).send(categoryNames);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getCategoriesName = getCategoriesName;
// getCategoryById
const getCategoryById = async (req, res, next) => {
    try {
        const category = await category_1.Category.findById(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).send(category);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getCategoryById = getCategoryById;
