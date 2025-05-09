import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../middleware/errorHandler';
import { Review } from '../models/Review';

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, rating, customerName, customerImage, productId } = req.body;

    console.log('Review Data Received:', req.body);
    console.log('Type of rating:', typeof rating);

    console.log('typeof rating:', typeof rating);
    console.log('typeof comment:', typeof comment);


    if (!comment || !rating || !productId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
    }

    const review = await Review.create({
      comment: comment.trim(),
      rating: typeof rating === 'string' ? parseFloat(rating) : rating,
      customerName: customerName?.trim() || 'Anonymous',
      customerImage: customerImage?.trim() || '',
      productId: productId.trim(),
    });

    return res.status(StatusCodes.CREATED).json(review);
  } catch (error) {
    console.error('Error while adding review:', error);
    return next(new CustomError(500, 'Something went wrong'));
  }
};




const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    console.log('Fetching reviews for productId:', productId);

    const trimmedProductId = productId.trim(); // Important to avoid mismatch due to spaces

    const [count, reviews] = await Promise.all([
      Review.countDocuments({ productId: trimmedProductId }),
      Review.find({ productId: trimmedProductId }).sort({ createdAt: -1 })
    ]);

    return res.status(StatusCodes.OK).json({ count, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return next(new CustomError(500, 'Something went wrong'));
  }
};

export { addReview, getProductReviews };
