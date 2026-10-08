import Gallery from "../models/gallery.model.js";

// Create a new gallery item (POST)
export const createGalleryItem = async (req, res) => {
  try {
    const galleryItem = new Gallery(req.body);
    await galleryItem.save();
    res.status(201).send(galleryItem); // 201 for resource creation success
  } catch (error) {
    res.status(400).send(error); // 400 for bad request
  }
};

// Get all gallery items (GET)
export const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    res.status(200).send(galleryItems); // 200 for success
  } catch (error) {
    res.status(500).send(error); // 500 for server error
  }
};

// Get gallery items by city (GET)
export const getGalleryItemsByCity = async (req, res) => {
  const { city } = req.query; // Extract city from query parameters
  try {
    const galleryItems = await Gallery.find({ city: city });
    res.status(200).send(galleryItems);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single gallery item by ID (GET)
export const getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) return res.status(404).send("Gallery item not found");
    res.send(galleryItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a gallery item by ID (PUT)
export const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!galleryItem) return res.status(404).send("Gallery item not found");
    res.send(galleryItem);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a gallery item by ID (DELETE)
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem) return res.status(404).send("Gallery item not found");
    res.send(galleryItem);
  } catch (error) {
    res.status(500).send(error);
  }
};
