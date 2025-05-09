"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protectAuth_1 = require("../middleware/protectAuth");
const uploads_1 = require("../middleware/uploads");
const product_1 = require("../controllers/product");
const productRoute = (0, express_1.Router)();
//new
productRoute.post('/add-product', uploads_1.upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), product_1.addProduct);
//productRoute.post('/add', addProduct);
productRoute.put('/update/:id', protectAuth_1.protectAuth, product_1.updateProduct);
productRoute.delete('/delete/:id', protectAuth_1.protectAuth, product_1.deleteProduct);
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
productRoute.put('update-after-sell/:id', product_1.updateProductAfterSelling);
productRoute.get('/total-money-earned', product_1.getTotalMoneyEarned);
productRoute.put('/update-status/:id', product_1.updateProductStatus);
productRoute.get('/total-revenue', product_1.calculateTotalRevenue);
exports.default = productRoute;
