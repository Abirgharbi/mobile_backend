"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductRating = exports.checkProductsInStock = exports.getDiscountedProducts = exports.getBestSellingProducts = exports.getProductsByCategory = exports.getPopularProducts = exports.getRecentProducts = exports.getFiltredProducts = exports.getProductById = exports.getProducts = exports.addProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("../middleware/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const product_1 = require("../models/product");
const category_1 = require("../models/category");
dotenv_1.default.config();
//new
const addProduct = async (req, res, next) => {
    try {
        const { name, price, compare_at_price, description, category, quantity, productCost, model, ratingsAverage, ratingsCount, colors, discount } = req.body;
        // Vérifier si les champs requis sont présents
        if (!name || !price || !compare_at_price || !description || !category || !quantity || !productCost) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const files = req.files;
        // Traiter les fichiers image et la miniature
        const imagePaths = files['images']?.map(file => `/uploads/${file.filename}`) || [];
        const thumbnailPath = files['thumbnail']?.[0]?.filename;
        // Vérifier si la miniature est présente
        if (!thumbnailPath) {
            return res.status(400).json({ message: 'Thumbnail is required.' });
        }
        // Création du produit dans la base de données
        const product = await product_1.Product.create({
            name,
            price,
            compare_at_price,
            description,
            category,
            quantity,
            productCost,
            model,
            thumbnail: `/uploads/${thumbnailPath}`,
            images: imagePaths,
            ratingsAverage,
            ratingsCount,
            colors: colors ? JSON.parse(colors) : [],
            discount
        });
        return res.status(http_status_codes_1.StatusCodes.CREATED).send(product);
    }
    catch (error) {
        const err = error;
        console.error(err.message);
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.addProduct = addProduct;
const getRecentProducts = async (req, res, next) => {
    try {
        var perPage = 6;
        var page = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, products] = await Promise.all([
            product_1.Product.countDocuments(),
            product_1.Product.find({ status: true }).sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getRecentProducts = getRecentProducts;
const getPopularProducts = async (req, res, next) => {
    try {
        var perPage = 6;
        var page = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, products] = await Promise.all([
            product_1.Product.countDocuments(),
            product_1.Product.find({ status: true }).sort({ totalRevenue: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getPopularProducts = getPopularProducts;
const getProducts = async (req, res, next) => {
    try {
        var perPage = 6;
        var page = Number(req.query.page);
        page > 0 ? page : page = 0;
        const [count, products] = await Promise.all([
            product_1.Product.countDocuments(),
            product_1.Product.find()
                .sort({ createdAt: -1 })
                .limit(perPage)
                .skip(perPage * page)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await product_1.Product.findById(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).send(product);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getProductById = getProductById;
const getFiltredProducts = async (req, res, next) => {
    try {
        const { min, max, rating } = req.query;
        const products = await product_1.Product.find({
            $and: [
                { status: true },
                { price: { $gte: min, $lte: max } },
                { ratingsAverage: { $gte: rating } }
            ]
        });
        const count = products.length;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getFiltredProducts = getFiltredProducts;
const getProductsByCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_1.Category.findById(id);
        const products = await product_1.Product.find({ category: category.name, status: true });
        const count = products.length;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getProductsByCategory = getProductsByCategory;
const getBestSellingProducts = async (req, res, next) => {
    try {
        const products = await product_1.Product.find({ status: true }).sort({ revenue: -1 }).limit(5);
        return res.status(http_status_codes_1.StatusCodes.OK).send(products);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getBestSellingProducts = getBestSellingProducts;
const getDiscountedProducts = async (req, res, next) => {
    try {
        const { discount } = req.query;
        const products = await product_1.Product.find({ discount: { $gte: discount }, status: true });
        const count = products.length;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getDiscountedProducts = getDiscountedProducts;
const checkProductsInStock = async (req, res, next) => {
    try {
        const product = req.body;
        const productIds = Object.keys(product);
        const productQuantities = Object.values(product);
        const allProducts = await product_1.Product.find({ _id: { $in: productIds } });
        const products = allProducts.filter((product, index) => {
            return product.quantity < productQuantities[index];
        });
        const count = products.length;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ count, products });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.checkProductsInStock = checkProductsInStock;
const updateProductRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        // Find the product by its ID
        const product = await product_1.Product.findById(id);
        if (!product) {
            // If the product is not found, return an error response
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }
        // Update the ratingsAverage and ratingsCount properties of the product
        product.ratingsCount++;
        product.ratingsAverage = (product.ratingsAverage * (product.ratingsCount - 1) + rating) / product.ratingsCount;
        // Save the updated product
        await product.save();
        // Return the updated product as a response
        return res.status(http_status_codes_1.StatusCodes.OK).json(product);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.updateProductRating = updateProductRating;
