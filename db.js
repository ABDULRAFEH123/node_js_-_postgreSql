// Import the entire module
import pg from 'pg';
import dotenv from "dotenv";


// Destructure to get Pool
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database:"TestDB" ,
  password:"admin",
  port: 5432,
});

export default pool;

