import express from "express";
import "./config/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRouter";
import customerRoute from "./routes/customersRouter";
import categoryRoute from "./routes/category";
import productRoute from "./routes/product";
//new
import path = require('path');
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://arkea-dashboard.vercel.app", "https://main.d20ufs6pozcpwc.amplifyapp.com"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
//new
app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));


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