import TripPlan from '../models/plan.model.js';



// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    const newBooking = new TripPlan(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking,
    });
  } catch (err) {
    next(err);
  }
};

