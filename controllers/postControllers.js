// GET ALL POSTS
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// let posts = [
//   {
//     id: 1,
//     name: "John Doe",
//     title: "Exploring the Mountains",
//     desc: "A thrilling adventure through the rocky terrain of the Appalachian mountains.",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     title: "Culinary Delights",
//     desc: "Discovering the best hidden gems in the culinary world.",
//   },
//   {
//     id: 3,
//     name: "Emily Johnson",
//     title: "Tech Innovations",
//     desc: "The latest advancements in technology and how they're changing the world.",
//   },
//   {
//     id: 4,
//     name: "Michael Brown",
//     title: "Fitness Goals",
//     desc: "Achieving your fitness goals with the right mindset and strategies.",
//   },
//   {
//     id: 5,
//     name: "Sarah Davis",
//     title: "Travel Diaries",
//     desc: "An exploration of various cultures through extensive travels around the globe.",
//   },
// ];

export const getPosts = async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  try {
    let query = "SELECT * FROM blogs";

    if (!isNaN(limit) && limit > 0) {
      query += ` LIMIT ${limit}`;
    }

    const result = await pool.query(query);
    const posts = result.rows;

    res.json(posts); // Send the posts array as JSON to the client
    console.log(posts, "its a;;;;;;;;");
  } catch (error) {
    next(error);
  }
};
// GET SINGLE POST BY THE HELP OF :id as a params...

export const getPost = async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "Invalid post ID" });
  }

  try {
    // Query to select the post by id
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: `Post with id ${id} is not found.` });
    }

    const post = result.rows[0];
    console.log(post, "its post....");

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// CREATE NEW POST...& ADD IT IN THE DATABASE..
export const createPost = async (req, res, next) => {
  const { name, title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please include the title." });
  }

  try {
    const newPostQuery = `
        INSERT INTO blogs(name, title, description)
        VALUES($1, $2, $3)
        RETURNING *;  
    `;
    const newPost = await pool.query(newPostQuery, [name, title, description]);

    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    next(error);
  }
};

// UPDATE THE POST WITH THE HELPF OF :id.
export const updatePost = async (req, res, next) => {
  const id = parseInt(req.params.id);

  const { title, name, description } = req.body;

  try {
    // SQL to check if the post exists
    const postExists = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      id,
    ]);
    console.log(postExists, "postExist:...");
    if (postExists.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Post with id ${id} is not found.` });
    }

    // SQL to update the post
    const updateQuery = `
      UPDATE blogs
      SET name = $1, title = $2, description = $3
      WHERE id = $4
      RETURNING *; 
    `;
    const updatedPost = await pool.query(updateQuery, [
      name,
      title,
      description,
      id,
    ]);
    console.log(updatePost, "updatedPostfound");
    res.status(200).json(updatedPost.rows[0]); // Send the updated post back
  } catch (error) {
    next(error);
  }
};

// DELTE THE POST WITH THE HELP OF :id...

export const deletePost = async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "Invalid post ID" });
  }

  try {
    // Check if the post exists
    const postExists = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      id,
    ]);
    if (postExists.rows.length === 0) {
      return res.status(404).json({ msg: `Post with id ${id} is not found.` });
    }

    // Delete the post
    await pool.query("DELETE FROM blogs WHERE id = $1", [id]);
    return res.status(200).json({ msg: `Post with id ${id} has been deleted` });
  } catch (error) {
    next(error);
  }
};

