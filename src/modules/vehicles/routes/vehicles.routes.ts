import { Router } from "express";
import { authenticateToken } from "../../../middleware/auth.middleware.js";
import {
  getVehicleByIdController,
  getVehiclesController,
  postVehiclesController,
} from "../controllers/vehicles.controller.js";

const router = Router();

router.get("/", getVehiclesController);

router.post("/", authenticateToken, postVehiclesController);

router.get("/:vehicleId", getVehicleByIdController);

export default router;
