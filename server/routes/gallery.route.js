import express from "express";
import {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryItemsByCity,
} from "../controllers/gallery.controller.js";

const router = express.Router();

// Routes
router.get("/test", (req, res) => {
  res.json({ msg: "API is working" });
});
router.post("/", createGalleryItem); // Create a new gallery item
router.get("/", getGalleryItems); // Get all gallery items
router.get("/city", getGalleryItemsByCity); // Get gallery items by city
router.get("/:id", getGalleryItemById); // Get a single gallery item by ID
router.put("/:id", updateGalleryItem); // Update a gallery item by ID
router.delete("/:id", deleteGalleryItem); // Delete a gallery item by ID

export default router;
