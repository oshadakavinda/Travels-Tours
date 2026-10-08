import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDest,
  deleteDestination,
  getDestinationNames,
  getDestinations,
  UpdateDestination,
  getDestinationDetails, // Import the new controller
} from "../controllers/dest.controller.js";

const router = express.Router();

// Existing routes...
router.post("/create-dest", verifyToken, createDest);
router.get("/get-dest", getDestinations);
router.get("/get-dest-names", getDestinationNames);

router.delete("/delete-dest/:destId", verifyToken, deleteDestination);
router.put("/update-dest/:destId", verifyToken, UpdateDestination);

// New route to get destination details by slug
router.get("/get-dest-details", getDestinationDetails); // Add this line

export default router;
