import express, { Router, json } from 'express';
import {getPost,getPosts,createPost,updatePost,deletePost} from "../controllers/postControllers.js"
const router = express.Router();



// posts.js
router.get("/", getPosts);  // Handles GET request with optional limit query
router.get("/:id", getPost); // Handles GET request to fetch a specific post by ID


router.post('/', createPost); // Handles POST request to create a new post
router.put("/:id", updatePost); // Handles PUT request to update a specific post
router.delete("/:id", deletePost); // Handles DELETE request to delete a specific post

// USER AUTH.. 

// router.post('/',register);
// router.post('/',Login);
// router.post('/',VerifyToken)

export default router;
