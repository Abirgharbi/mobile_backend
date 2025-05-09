"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/connect");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const customersRouter_1 = __importDefault(require("./routes/customersRouter"));
const category_1 = __importDefault(require("./routes/category"));
const product_1 = __importDefault(require("./routes/product"));
const review_1 = __importDefault(require("./routes/review"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Serving assetlinks.json manually
app.get('/.well-known/assetlinks.json', (req, res) => {
    const assetPath = path_1.default.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json');
    console.log('Serving assetlinks.json from:', assetPath);
    res.sendFile(assetPath);
});
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://arkea-dashboard.vercel.app", "https://main.d20ufs6pozcpwc.amplifyapp.com"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
//new
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.use(express_1.default.urlencoded({
    extended: true,
}));
// routes
app.use("/user", authRouter_1.default); // auth route
app.use("/user/customer", customersRouter_1.default);
app.use("/product/category", category_1.default);
app.use("/product", product_1.default);
app.use('/review', review_1.default);
app.listen(4002, () => console.log(`server running on port : ${process.env.PORT} \n`));
exports.default = app;
