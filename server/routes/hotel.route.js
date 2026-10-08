import express from "express";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getHotelsByCity,
} from "../controllers/hotel.controller.js";

const router = express.Router();

// Routes
router.get("/test", (req, res) => {
  res.json({ msg: "api is working" });
});
router.post("/", createHotel); // Create a new hotel
router.get("/", getHotels); // Get all hotels
router.get("/hotels", getHotelsByCity); // Get all hotels by city
router.get("/:id", getHotelById); // Get a single hotel by ID
router.put("/:id", updateHotel); // Update a hotel by ID
router.delete("/:id", deleteHotel); // Delete a hotel by ID

export default router;
