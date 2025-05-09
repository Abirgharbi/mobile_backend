"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_1 = require("../controllers/review");
const router = express_1.default.Router();
router.post('/add', review_1.addReview);
router.get('/product/:productId', review_1.getProductReviews);
exports.default = router;
