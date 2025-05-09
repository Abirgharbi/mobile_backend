import express from "express";
import "./config/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRouter";
import customerRoute from "./routes/customersRouter";
import categoryRoute from "./routes/category";
import productRoute from "./routes/product";
import path from 'path';

const app = express();

// Serving assetlinks.json manually
app.get('/.well-known/assetlinks.json', (req, res) => {
  const assetPath = path.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json');
  console.log('Serving assetlinks.json from:', assetPath);
  res.sendFile(assetPath);
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://arkea-dashboard.vercel.app", "https://main.d20ufs6pozcpwc.amplifyapp.com"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes
app.use("/user", authRoute); // auth route
app.use("/user/customer", customerRoute);
app.use("/product/category", categoryRoute);
app.use("/product", productRoute);

app.listen(4002, () =>
  console.log(`server running on port : ${process.env.PORT} \n`)
);

export default app;
