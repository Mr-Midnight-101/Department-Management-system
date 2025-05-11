import connectDB from "./database/connect.database.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is running at: ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("!MongoDB connection failed: ", error);
  });
