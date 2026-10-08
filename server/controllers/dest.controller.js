import Destination from "../models/destination.model.js";
import { errorHandler } from "../utils/error.js";

// export const createDest = async (req, rest, next) => {
//   if (!req.user.isAdmin) {
//     return next(
//       errorHandler(
//         403,
//         "You are not authenticated to make changes to the database"
//       )
//     );
//   }
//   if (!req.body.destinationName || !req.body.description) {
//     return next(errorHandler(400, "Please fill all the required fields"));
//   }
//   const slug = req.body.destinationName
//     .split(" ")
//     .join("-")
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9-]/g, "-");
//   const newDestination = new Destination({
//     ...req.body,
//     slug,
//     userId: req.user.id,
//     activities: req.body.activities || [], // Allow adding activities
//   });

//   try {
//     const savedDestination = await newDestination.save();
//     rest.status(201).json(savedDestination);
//   } catch (error) {
//     next(error);
//   }
// };

export const createDest = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(
        403,
        "You are not authenticated to make changes to the database"
      )
    );
  }
  if (!req.body.destinationName || !req.body.description) {
    return next(errorHandler(400, "Please fill all the required fields"));
  }

  if (req.body.additionalImages && req.body.additionalImages.length > 5) {
    return next(errorHandler(400, "You can upload a maximum of 5 images"));
  }

  const slug = req.body.destinationName
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newDestination = new Destination({
    ...req.body,
    slug,
    userId: req.user.id,
    activities: req.body.activities || [],
    additionalImages: req.body.additionalImages || [], // Store up to 5 images
  });

  try {
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    next(error);
  }
};

// abve is new



export const getDestinations = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Fetch destinations based on query parameters
    const destinations = await Destination.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.destId && { _id: req.query.destId }),
      ...(req.query.searchTerm && {
        $or: [
          { destinationName: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
          { activities: { $regex: req.query.searchTerm, $options: "i" } }, // Search in activities
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Total number of destinations
    const totalDestinations = await Destination.countDocuments();

    // Number of destinations created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthDestinations = await Destination.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      destinations,
      totalDestinations,
      lastMonthDestinations,
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationNames = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const destinations = await Destination.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.destId && { _id: req.query.destId }),
      ...(req.query.searchTerm && {
        $or: [
          { destinationName: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
          { activities: { $regex: req.query.searchTerm, $options: "i" } }, // Search in activities
        ],
      }),
    })
      .select("destinationName") // Select only destinationName field
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      destinations,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this destination")
    );
  }
  try {
    await Destination.findByIdAndDelete(req.params.destId);
    res.status(200).json("The destination has been deleted");
  } catch (error) {
    next(error);
  }
};

// export const UpdateDestination = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(
//       errorHandler(403, "You are not allowed to update this destination")
//     );
//   }
//   try {
//     const updatedDestination = await Destination.findByIdAndUpdate(
//       req.params.destId,
//       {
//         $set: {
//           destinationName: req.body.destinationName,
//           description: req.body.description,
//           destImage: req.body.destImage,
//           activities: req.body.activities || [], // Update activities
//         },
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedDestination);
//   } catch (error) {
//     next(error);
//   }
// };

export const UpdateDestination = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to update this destination")
    );
  }

  if (req.body.additionalImages && req.body.additionalImages.length > 5) {
    return next(errorHandler(400, "You can upload a maximum of 5 images"));
  }

  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.destId,
      {
        $set: {
          destinationName: req.body.destinationName,
          description: req.body.description,
          destImage: req.body.destImage,
          activities: req.body.activities || [],
          additionalImages: req.body.additionalImages || [], // Update gallery images
        },
      },
      { new: true }
    );
    res.status(200).json(updatedDestination);
  } catch (error) {
    next(error);
  }
};

// above is new

export const getDestinationDetails = async (req, res, next) => {
  try {
    const { slug } = req.query; // Extract the slug from query params

    if (!slug) {
      return next(errorHandler(400, "Destination slug is required"));
    }

    // Find the destination by slug
    const destination = await Destination.findOne({ slug: slug });

    if (!destination) {
      return next(errorHandler(404, "Destination not found"));
    }

    // Return the description and activities
    res.status(200).json({
      description: destination.description,
      activities: destination.activities,
    });
  } catch (error) {
    next(error);
  }
};
