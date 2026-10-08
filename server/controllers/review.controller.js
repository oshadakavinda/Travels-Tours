import Review from "../models/review.model.js";
import { errorHandler } from "../utils/error.js";

// Create a review
export const createReview = async (req, res, next) => {
    try {
        const { rating, comment, images, userId } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to create this review'));
        }
        const newReview = new Review({
            rating,
            comment,
            images,
            userId,
        });
        await newReview.save();
        res.status(200).json(newReview);
    } catch (error) {
        next(error);
    }
};

// Get all reviews (for admin purposes)
// In review.controller.js, modify the getReviews function:
export const getReviews = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        
        const reviews = await Review.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
            
        const totalReviews = await Review.countDocuments();
        
        res.status(200).json({ 
            reviews, 
            totalReviews
        });
    } catch (error) {
        next(error);
    }
};


export const getUserReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// Like a review
export const likeReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }
        const userIndex = review.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            review.numberOfLikes += 1;
            review.likes.push(req.user.id);
        } else {
            review.numberOfLikes -= 1;
            review.likes.splice(userIndex, 1);
        }
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
};

// Edit a review
export const editReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }
        if (review.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to edit this review'));
        }
        review.rating = req.body.rating;
        review.comment = req.body.comment;
        review.images = req.body.images;
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }
        if (review.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this review'));
        }
        await Review.findByIdAndDelete(req.params.reviewId);
        res.status(200).json('Review deleted');
    } catch (error) {
        next(error);
    }
};