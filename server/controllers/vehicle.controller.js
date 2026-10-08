import { errorHandler } from "../utils/error.js";
import Vehicle from "../models/vehicle.model.js";

export const create = async (req, res, next) => {
  console.log(req.user);
  // if(!req.user.isAdmin)
  //     {
  //         return next(errorHandler(403,'You are not allowed'));
  //     }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required content"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newVehicle = new Vehicle({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    next(error);
  }
};

// Get vehicles with filtering and pagination
export const getVehicles = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const vehicles = await Vehicle.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.vehicleId && { _id: req.query.vehicleId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalVehicles = await Vehicle.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthVehicles = await Vehicle.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Aggregate daily vehicle stats
    const dailyVehicleStats = await Vehicle.aggregate([
      {
        $match: { createdAt: { $gte: oneMonthAgo } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      vehicles,
      totalVehicles,
      lastMonthVehicles,
      dailyVehicleStats, // Send the daily vehicle stats to the frontend
    });
  } catch (error) {
    next(error);
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You do not have permission to delete"));
  }
  try {
    await Vehicle.findByIdAndDelete(req.params.vehicleId);
    res.status(200).json("The vehicle was deleted");
  } catch (error) {
    next(error);
  }
};

// Update a vehicle
export const updateVehicle = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update"));
  }
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.vehicleId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedVehicle);
  } catch (error) {
    next(error);
  }
};
