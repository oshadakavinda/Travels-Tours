import Hotel from "../models/hotel.model.js";

// Create a new hotel (POST)
export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).send(hotel); // 201 for resource creation success
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all hotels (GET)
export const getHotels = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch hotels based on query parameters
    const hotels = await Hotel.find({
      ...(req.query.city && { city: req.query.city }),
      ...(req.query.name && { name: { $regex: req.query.name, $options: 'i' } }),
      ...(req.query.rating && { rating: { $gte: parseInt(req.query.rating) } }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Total number of hotels
    const totalHotels = await Hotel.countDocuments();

    // Number of hotels created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthHotels = await Hotel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      hotels,
      totalHotels,
      lastMonthHotels,
    });
  } catch (error) {
    next(error);
  }
};


// Get hotels by city (GET)
export const getHotelsByCity = async (req, res) => {
  const { city } = req.query; // Extract city from query
  try {
    // Find hotels that match the provided city
    const hotels = await Hotel.find({ city: city }); // Adjust this according to your model
    res.status(200).send(hotels); // Send the filtered hotels
  } catch (error) {
    res.status(500).send(error);
  }
};


// Get a single hotel by ID (GET)
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a hotel by ID (PUT)
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a hotel by ID (DELETE)
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(500).send(error);
  }
};
