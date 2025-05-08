import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

connect(
    process.env.DATABASE_URL || '',
    {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    }
).then(() => {
    console.log("Database connected..");
});
