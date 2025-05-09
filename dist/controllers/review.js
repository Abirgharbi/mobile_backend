"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = exports.addReview = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = require("../middleware/errorHandler");
const Review_1 = require("../models/Review");
const addReview = async (req, res, next) => {
    try {
        const { comment, rating, customerName, customerImage, productId } = req.body;
        console.log('Review Data Received:', req.body);
        console.log('Type of rating:', typeof rating);
        console.log('typeof rating:', typeof rating);
        console.log('typeof comment:', typeof comment);
        if (!comment || !rating || !productId) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
        }
        const review = await Review_1.Review.create({
            comment: comment.trim(),
            rating: typeof rating === 'string' ? parseFloat(rating) : rating,
            customerName: customerName?.trim() || 'Anonymous',
            customerImage: customerImage?.trim() || '',
            productId: productId.trim(),
        });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(review);
    }
    catch (error) {
        console.error('Error while adding review:', error);
        return next(new errorHandler_1.CustomError(500, 'Something went wrong'));
    }
};
exports.addReview = addReview;
const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        console.log('Fetching reviews for productId:', productId);
        const trimmedProductId = productId.trim(); // Important to avoid mismatch due to spaces
        const [count, reviews] = await Promise.all([
            Review_1.Review.countDocuments({ productId: trimmedProductId }),
            Review_1.Review.find({ productId: trimmedProductId }).sort({ createdAt: -1 })
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ count, reviews });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return next(new errorHandler_1.CustomError(500, 'Something went wrong'));
    }
};
exports.getProductReviews = getProductReviews;
