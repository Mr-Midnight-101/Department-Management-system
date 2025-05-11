import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.DATABASE}/${DB_NAME}`
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    //!DB host
  } catch (error) {
    console.error(`Error connection FAILED: ${error.message}`);
    //!listeners in express that listens with on
    //* error, data, and are events and callback
    app.on("error", (err) => {
      console.log(err);

      //! nodeJS builtin process reference can be used for exit and multiple with exit(1) where 1 is method reference and have multiple type
      process.exit(1);
    });
  }
};

export default connectDB;
