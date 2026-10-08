import { verifyToken } from "../utils/verifyUser.js";
import { create, deleteVehicle, getVehicles, updateVehicle } from "../controllers/vehicle.controller.js";
import express from "express";


const router = express.Router();
router.post('/create', verifyToken, create);
router.get('/getvehicles', getVehicles);
router.delete('/deletevehicle/:vehicleId/:userId', verifyToken, deleteVehicle)
router.put('/updatevehicle/:vehicleId/:userId', verifyToken, updateVehicle);

export default router;