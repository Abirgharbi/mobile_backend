import { Category } from '../models/category';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../middleware/errorHandler';
import dotenv from 'dotenv';
dotenv.config();

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body;

        const category = await Category.create({
            name, image
        });
        return res.status(StatusCodes.OK).send(category);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name, image
        }, { new: true });
        return res.status(StatusCodes.OK).send(category);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).send(category);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getCategories = async (req: Request, res: Response, next: NextFunction) => {

    try {
        var perPage = 5;
        var page: number = Number(req.query.page);
        page > 0 ? page : page = 0;

        const [count, categories] = await Promise.all([
            Category.countDocuments(),
            Category.find()
                .sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);

        return res.status(StatusCodes.OK).send({ count, categories });
    } catch (error) {
        return next(
            new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
        );
    }
};

// getCategoriesName
const getCategoriesName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find().select('name -_id').exec();
        const categoryNames = categories.map(category => category.name);
        return res.status(StatusCodes.OK).send(categoryNames);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

// getCategoryById
const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findById(req.params.id);
        return res.status(StatusCodes.OK).send(category);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}


export {
    addCategory, updateCategory, deleteCategory,
    getCategories, getCategoriesName, getCategoryById
};
