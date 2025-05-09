import express from 'express';
import { addReview, getProductReviews } from '../controllers/review';

const router = express.Router();

router.post('/add', addReview);

router.get('/product/:productId', getProductReviews);


export default router;
