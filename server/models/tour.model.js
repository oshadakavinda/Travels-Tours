import mongoose from "mongoose";

const { Schema } = mongoose;

const tourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    destinations: [
      { type: Schema.Types.ObjectId, ref: "Destination", required: true }
    ],
    days: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
