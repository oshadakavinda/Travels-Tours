import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    likes: {
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;