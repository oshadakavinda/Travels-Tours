import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import hotelRoutes from "./routes/hotel.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import destRoutes from "./routes/destination.route.js";
import tourRoutes from "./routes/tour.route.js";
import galleryRoutes from "./routes/gallery.route.js";
import tripPlanRoutes from "./routes/plan.route.js";
import reviewRoutes from "./routes/review.route.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bookingRoutes from "./routes/booking.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
const __dirname = path.resolve();

const app = express();

// CORS configuration for local development and Vercel deployment
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://lh3.googleusercontent.com",
  process.env.FRONTEND_URL // Add your Vercel frontend URL in environment variables
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/destination", destRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/trip-plan", tripPlanRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// For Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
}
