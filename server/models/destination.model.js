import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
      unique: true,
    },
    destImage: {
      type: String,
      default: "", // Default cover photo
    },
    additionalImages: {
      type: [String], // Array of image URLs
      validate: [arrayLimit, "{PATH} exceeds the limit of 5 images"],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    activities: {
      type: [String], // Array of strings
      default: [],
    },
  },
  { timestamps: true }
);

// Validation function to limit galleryImages to 5
function arrayLimit(val) {
  return val.length <= 5;
}

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
