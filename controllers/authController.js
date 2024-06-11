import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// AUTH USER...

export const register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
        // Check if user with the same email already exists
        const existingUserQuery = 'SELECT * FROM auth WHERE email = $1';
        const existingUser = await pool.query(existingUserQuery, [email]);
    
        if (existingUser.rows.length > 0) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        `INSERT INTO auth (username,email,password) VALUES ($1,$2,$3)
      RETURNING *`,
        [username, email, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  
  export const Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await pool.query('SELECT * FROM auth WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
  
      const token = jwt.sign({ userId: user.id }, process.env.SECRETKEY, {
        expiresIn: '1h', // Correct option
      });
  
      res.json({ token });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };
  
  export const verifyToken = async (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    console.log(token, "its token..");
  
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      req.user = decoded;
      console.log(decoded, "its decoded..");
      next();
    } catch (error) {
      console.log("TOKEN VERIFICATION FAILED", error.message);
      return res.status(401).json({ message: "Token verification failed" });
    }
  };