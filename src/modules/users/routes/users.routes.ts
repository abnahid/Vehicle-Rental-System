import { Router } from "express";
import { authenticateToken } from "../../../middleware/auth.middleware.js";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/users.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllUsersController);

router.get("/:userId", getUserByIdController);

router.put("/:userId", updateUserController);

router.delete("/:userId", deleteUserController);

export default router;
