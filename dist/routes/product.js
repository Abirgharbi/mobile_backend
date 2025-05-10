"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_1 = require("../middleware/uploads");
const product_1 = require("../controllers/product");
const productRoute = (0, express_1.Router)();
//new
productRoute.post('/add-product', uploads_1.upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), product_1.addProduct);
productRoute.get('/get', product_1.getProducts);
productRoute.get('/get/:id', product_1.getProductById);
productRoute.get('/filter', product_1.getFiltredProducts);
productRoute.get('/recent', product_1.getRecentProducts);
productRoute.get('/popular', product_1.getPopularProducts);
productRoute.get('/product-by-category/:id', product_1.getProductsByCategory);
productRoute.get('/best-selling', product_1.getBestSellingProducts);
productRoute.get('/discount', product_1.getDiscountedProducts);
productRoute.post('/check-availability', product_1.checkProductsInStock);
productRoute.put('/update-rating/:id', product_1.updateProductRating);
exports.default = productRoute;
