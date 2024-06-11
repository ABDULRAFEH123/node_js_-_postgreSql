import express from "express";
import pool from "./db.js";
import errorHandler from "./middleware/errorHandler.js";
import posts from "./routes/posts.js";
import auth from "./routes/auth.js"
import logger from "./middleware/logger.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 9000;


// app.all("*", (req, res, next) => {
// const error =new Error(`Cannot Find ${req.originalUrl} on the Server!`);
// error.status ="fail";
// error.statusCode =400;

// next(error);
// })
// // Middleware to handle errors
// app.use((err,req, res, next) => {
//   err.statusCode=err.statusCode || 500;
//   err.status=err.status || "error";
//   res.status(err.statusCode).json({
//     status:err.statusCode,
//     message:err.message
//   })
// });
// Use the error handling middleware
app.use(errorHandler);

// LOGGER MIDDLEWARE
app.use(logger);

// BODY PARSER MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTER
app.use("/api/posts", posts);


// FOR AUTH APIS.. ROUTE..
app.use("/api/auth",auth)

// THIS IS THE DEFAULT PAGE..
app.get('/', (req, res) => {
  res.send('Welcome to my Express server!');
});
app.get("/data", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM your_table");
    console.log(rows,"its rows..")
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// Specify the host as 127.0.0.1
const HOST = "127.0.0.1";
// app.listen(PORT,()=>{
//   console.log(`server is running on port ${PORT}`)
// })

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
