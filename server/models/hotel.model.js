import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    description: {
      type: String,
    },

    coverImageURL: {
      type: String,
    },

    hotelImageURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
