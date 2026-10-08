import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    createReview,
    getUserReviews,
    likeReview,
    editReview,
    deleteReview,
    getReviews,
} from '../controllers/review.controller.js';

const router = express.Router();

// Create a review
router.post('/create', verifyToken, createReview);

// get reviews
router.get('/getReviews', getReviews);

// Get reviews by user ID
router.get('/getUserReviews/:userId', getUserReviews);

// Like or unlike a review
router.put('/likeReview/:reviewId', verifyToken, likeReview);

// Edit a review
router.put('/editReview/:reviewId', verifyToken, editReview);

// Delete a review
router.delete('/deleteReview/:reviewId', verifyToken, deleteReview);

export default router;