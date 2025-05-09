"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalRevenue = exports.updateProductStatus = exports.getTotalMoneyEarned = exports.updateProductAfterSelling = exports.updateProductRating = exports.checkProductsInStock = exports.getDiscountedProducts = exports.getBestSellingProducts = exports.getProductsByCategory = exports.getPopularProducts = exports.getRecentProducts = exports.getFiltredProducts = exports.getProductById = exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = void 0;
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
// const addProduct = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const {
//             name,
//             price,
//             compare_at_price,
//             description,
//             category,
//             images,
//             quantity,
//             thumbnail,
//             productCost,
//             model,
//             ratingsAverage,
//             ratingsCount,
//             colors,
//             discount
//         } = req.body;
//         const product = model
//             ? await Product.create({
//                 name,
//                 price,
//                 compare_at_price,
//                 description,
//                 category,
//                 quantity,
//                 productCost,
//                 model,
//                 thumbnail,
//                 ratingsAverage,
//                 ratingsCount,
//                 colors,
//                 discount
//             })
//             : await Product.create({
//                 name,
//                 price,
//                 compare_at_price,
//                 description,
//                 category,
//                 images,
//                 thumbnail,
//                 productCost,
//                 ratingsAverage,
//                 ratingsCount,
//                 quantity,
//                 colors,
//                 discount
//             });
//         return res.status(StatusCodes.OK).send(product);
//     } catch (error) {
//         return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
//     }
// }
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, compare_at_price, description, category, images, quantity, thumbnail, productCost, ratingsAverage, ratingsCount, colors } = req.body;
        const product = await product_1.Product.findByIdAndUpdate(req.params.id, {
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
        return res.status(http_status_codes_1.StatusCodes.OK).send(product);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await product_1.Product.findByIdAndDelete(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).send(product);
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.deleteProduct = deleteProduct;
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
const updateProductAfterSelling = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const product = await product_1.Product.findById(id);
        if (!product) {
            return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found'));
        }
        const newQuantity = product.quantity - quantity;
        const revenue = product.totalRevenue + ((product.price - product.productCost) * quantity);
        const updatedProduct = await product_1.Product.updateOne({ _id: product._id }, { quantity: newQuantity, totalRevenue: revenue }, { new: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Product updated successfully', updatedProduct });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.updateProductAfterSelling = updateProductAfterSelling;
const getTotalMoneyEarned = async (req, res, next) => {
    try {
        const products = await product_1.Product.find();
        const totalMoneyEarned = products.reduce((acc, product) => {
            return acc + product.totalRevenue;
        }, 0);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ totalMoneyEarned });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.getTotalMoneyEarned = getTotalMoneyEarned;
const updateProductStatus = async (req, res, next) => {
    try {
        const product = await product_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
        }
        const updatedProduct = await product_1.Product.updateOne({ _id: product._id }, { status: !product.status }, { new: true });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ updatedProduct });
    }
    catch (error) {
        return next(new errorHandler_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
};
exports.updateProductStatus = updateProductStatus;
const calculateTotalRevenue = async (req, res, next) => {
    try {
        const result = await product_1.Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalRevenue" }
                }
            }
        ]);
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        return res.status(http_status_codes_1.StatusCodes.OK).send({ totalRevenue });
    }
    catch (error) {
        console.error("Error calculating total revenue:", error);
    }
};
exports.calculateTotalRevenue = calculateTotalRevenue;
