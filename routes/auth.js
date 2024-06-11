import express, { Router, json } from 'express';
import {register,Login,verifyToken} from "../controllers/authController.js"
const router = express.Router();

router.post('/register', register);
router.post('/login', Login);
router.post('/verify-token', verifyToken, (req, res) => {
    // Convert Unix timestamps to human-readable date and time
    const issuedAt = new Date(req.user.iat * 1000).toLocaleString();
    const expiresAt = new Date(req.user.exp * 1000).toLocaleString();

    
    res.status(200).json({
        message: "Token is valid",
        user: req.user,
        issuedAt,
        expiresAt
    });
});

export default router;