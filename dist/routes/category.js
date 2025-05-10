"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../controllers/category");
const uploads_1 = require("../middleware/uploads");
const categoryRoute = (0, express_1.Router)();
//categoryRoute.post('/add', addCategory);
//new
categoryRoute.post('/add', uploads_1.upload.single('image'), category_1.addCategory);
categoryRoute.get('/get', category_1.getCategories);
categoryRoute.get('/getname', category_1.getCategoriesName);
categoryRoute.get('/get/:id', category_1.getCategoryById);
exports.default = categoryRoute;
