import mongoose from "mongoose";

const tripPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    // General Information
    arrivalDate: {
      type: Date,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: String,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    numberOfAdults: {
      type: Number,
    },
    numberOfChildren: {
      type: Number,
    },
    dateComments: {
      type: String,
    },
    // Location Information
    selectedDestinations: [
      {
        type: String,
        required: true,
      },
    ],
    additionalLocations: {
      type: String,
    },
    // Accommodation
    accommodationType: {
      type: String,
      required: true,
    },
    mealPlan: {
      type: String,
      default: "Not specified",
    },
    accommodationPreference: {
      type: String,
    },
    // Transport
    vehicleType: {
      type: String,
      required: true,
    },
    numberOfVehicles: {
      type: Number,
      default: "Not specified",
    },
    transportPreference: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    comType: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const TripPlan = mongoose.model("TripPlan", tripPlanSchema);

export default TripPlan;
