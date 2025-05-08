
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../middleware/errorHandler';


import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { Product } from '../models/product';
import { Category } from '../models/category';

dotenv.config();

const addProduct = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {
            name,
            price,
            compare_at_price,
            description,
            category,
            images,
            quantity,
            thumbnail,
            productCost,
            model,
            ratingsAverage,
            ratingsCount,
            colors,
            discount
        } = req.body;

        const product = model
            ? await Product.create({
                name,
                price,
                compare_at_price,
                description,
                category,
                quantity,
                productCost,
                model,
                thumbnail,
                ratingsAverage,
                ratingsCount,
                colors,
                discount
            })
            : await Product.create({
                name,
                price,
                compare_at_price,
                description,
                category,
                images,
                thumbnail,
                productCost,
                ratingsAverage,
                ratingsCount,
                quantity,
                colors,
                discount
            });

        return res.status(StatusCodes.OK).send(product);
    } catch (error) {

        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name,
            price,
            compare_at_price,
            description,
            category,
            images,
            quantity,
            thumbnail,
            productCost,
            ratingsAverage,
            ratingsCount,
            colors } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            compare_at_price,
            description,
            category,
            images,
            quantity,
            thumbnail,
            productCost,
            ratingsAverage,
            ratingsCount,
            colors
        }, { new: true });
        return res.status(StatusCodes.OK).send(product);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).send(product);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}
const getRecentProducts = async (req: Request, res: Response, next: NextFunction) => {

    try {
        var perPage = 6;
        var page: number = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, products] = await Promise.all([
            Product.countDocuments(),
            Product.find({ status: true }).sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);

        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getPopularProducts = async (req: Request, res: Response, next: NextFunction) => {

    try {

        var perPage = 6;
        var page: number = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, products] = await Promise.all([
            Product.countDocuments(),
            Product.find({ status: true }).sort({ totalRevenue: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);

        return res.status(StatusCodes.OK).send({ count, products });

    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}


const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var perPage = 6;
        var page: number = Number(req.query.page);
        page > 0 ? page : page = 0;

        const [count, products] = await Promise.all([
            Product.countDocuments(),
            Product.find()
                .sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);

        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(StatusCodes.OK).send(product);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getFiltredProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { min, max, rating } = req.query;

        const products = await Product.find({
            $and: [
                { status: true },
                { price: { $gte: min, $lte: max } },
                { ratingsAverage: { $gte: rating } }
            ]
        });
        const count = products.length;
        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        const products = await Product.find({ category: category!.name, status: true });

        const count = products.length;
        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getBestSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ status: true }).sort({ revenue: -1 }).limit(5);
        return res.status(StatusCodes.OK).send(products);
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getDiscountedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { discount } = req.query;

        const products = await Product.find({ discount: { $gte: discount }, status: true });
        const count = products.length;
        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}
const checkProductsInStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = req.body;

        const productIds = Object.keys(product);
        const productQuantities: number[] = Object.values(product);
        const allProducts = await Product.find({ _id: { $in: productIds } });
        const products = allProducts.filter((product, index) => {
            return product.quantity < productQuantities[index];
        });
        const count = products.length;
        return res.status(StatusCodes.OK).send({ count, products });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}


const updateProductRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        // Find the product by its ID
        const product = await Product.findById(id);

        if (!product) {
            // If the product is not found, return an error response
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        // Update the ratingsAverage and ratingsCount properties of the product
        product.ratingsCount++;
        product.ratingsAverage = (product.ratingsAverage * (product.ratingsCount - 1) + rating) / product.ratingsCount;

        // Save the updated product
        await product.save();

        // Return the updated product as a response
        return res.status(StatusCodes.OK).json(product);

    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}


const updateProductAfterSelling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return next(new CustomError(StatusCodes.NOT_FOUND, 'Product not found'));
        }

        const newQuantity = product.quantity - quantity;

        const revenue = product.totalRevenue + ((product.price - product.productCost) * quantity);

        const updatedProduct = await Product.updateOne({ _id: product._id }, { quantity: newQuantity, totalRevenue: revenue }, { new: true });

        res.status(StatusCodes.OK).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const getTotalMoneyEarned = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();
        const totalMoneyEarned = products.reduce((acc, product) => {
            return acc + product.totalRevenue;
        }, 0);
        return res.status(StatusCodes.OK).send({ totalMoneyEarned });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
}

const updateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.updateOne({ _id: product._id }, { status: !product.status }, { new: true });

        return res.status(StatusCodes.OK).json({ updatedProduct });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};

const calculateTotalRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalRevenue" }
                }
            }
        ]);

        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        return res.status(StatusCodes.OK).send({ totalRevenue });
    } catch (error) {
        console.error("Error calculating total revenue:", error);
    }
};


export { addProduct, updateProduct, deleteProduct, getProducts, getProductById, getFiltredProducts, getRecentProducts, getPopularProducts, getProductsByCategory, getBestSellingProducts, getDiscountedProducts, checkProductsInStock, updateProductRating, updateProductAfterSelling, getTotalMoneyEarned, updateProductStatus, calculateTotalRevenue };
