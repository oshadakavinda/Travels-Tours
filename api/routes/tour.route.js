import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deleteTour,
  getTours,
  updateTour,
  getTour,
} from "../controllers/tour.controller.js";
import express from "express";

const router = express.Router();

// Create a new tour (protected)
router.post('/create', verifyToken, create);

// Get all tours
router.get('/gettours', getTours);

// Get a specific tour by ID
router.get('/gettour/:tourId', getTour);

// Update a specific tour (protected)
router.put('/update-tour/:tourId', verifyToken, updateTour);

// Delete a specific tour (protected)
router.delete('/delete-tour/:tourId/:userId', verifyToken, deleteTour);

export default router;
