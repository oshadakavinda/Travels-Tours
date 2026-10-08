import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createTripPlan,
  getTripPlans,
  getUserTripPlans,
  getTripPlanById,
  updateTripPlan,
  deleteTripPlan,
} from "../controllers/plan.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/create", verifyToken, createTripPlan);
router.get("/get", verifyToken, getTripPlans);
router.get("/user-trips", verifyToken, getUserTripPlans);
router.put("/update/:tripPlanId", verifyToken, updateTripPlan);
router.delete("/delete/:tripPlanId", verifyToken, deleteTripPlan);

router.get("/get/:id", verifyToken, getTripPlanById);

export default router;
