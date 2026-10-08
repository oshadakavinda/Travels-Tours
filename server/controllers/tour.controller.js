import { errorHandler } from '../utils/error.js';
import Tour from '../models/tour.model.js';

// Create a new tour
export const create = async (req, res, next) => {
    // Validate required fields based on schema
    if (!req.body.title || !req.body.desc || !req.body.days || 
        !req.body.destinations || !req.body.photo) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    // Create URL-friendly slug from title
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    // Create new tour instance with only schema-defined fields
    const newTour = new Tour({
        title: req.body.title,
        desc: req.body.desc,
        days: req.body.days,
        destinations: req.body.destinations,
        photo: req.body.photo
    });

    try {
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        next(error);
    }
};

// Get a single tour by ID
export const getTour = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.tourId)
            .populate('destinations', 'name location')
            .maxTimeMS(60000);

        if (!tour) {
            return next(errorHandler(404, "Tour not found"));
           
        }

        res.status(200).json(tour);
    } catch (error) {
        next(error);
    }
};

// Get tours with filtering and pagination
export const getTours = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Build query with filters matching schema fields
        const tours = await Tour.find({
            ...(req.query.tourId && { _id: req.query.tourId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { desc: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
            ...(req.query.destination && { 
                destinations: { $in: [req.query.destination] } 
            }),
            ...(req.query.minDays && { days: { $gte: parseInt(req.query.minDays) } }),
            ...(req.query.maxDays && { days: { $lte: parseInt(req.query.maxDays) } }),
        })
            .populate('destinations', 'name location')
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .maxTimeMS(60000);

        // Get total count of tours
        const totalTours = await Tour.countDocuments();
        
        // Get count of tours created in last month
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthTours = await Tour.countDocuments({ 
            createdAt: { $gte: oneMonthAgo } 
        });

        res.status(200).json({
            tours,
            totalTours,
            lastMonthTours,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a tour
export const deleteTour = async (req, res, next) => {
    try {
        await Tour.findByIdAndDelete(req.params.tourId);
        res.status(200).json('The tour has been deleted successfully');
    } catch (error) {
        next(error);
    }
};

// Update a tour
export const updateTour = async (req, res, next) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.tourId,
            {
                $set: {
                    title: req.body.title,
                    desc: req.body.desc,
                    photo: req.body.photo,
                    days: req.body.days,
                    destinations: req.body.destinations,
                }
            },
            { new: true }
        ).populate('destinations', 'name location');

        res.status(200).json(updatedTour);
    } catch (error) {
        next(error);
    }
};