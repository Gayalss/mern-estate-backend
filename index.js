import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
