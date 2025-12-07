import { Router } from "express";
import { authenticateToken } from "../../../middleware/auth.middleware.js";
import {
  deleteVehicleController,
  getVehicleByIdController,
  getVehiclesController,
  postVehiclesController,
  updateVehicleController,
} from "../controllers/vehicles.controller.js";

const router = Router();

router.get("/", getVehiclesController);

router.post("/", authenticateToken, postVehiclesController);

router.get("/:vehicleId", getVehicleByIdController);

router.put("/:vehicleId", authenticateToken, updateVehicleController);

router.delete("/:vehicleId", authenticateToken, deleteVehicleController);

export default router;
