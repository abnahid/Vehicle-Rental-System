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

/**
 * GET /api/v1/users/:userId
 * Get specific user (admin or own user)
 * Access: Admin or Own user
 */
router.get("/:userId", getUserByIdController);

/**
 * PUT /api/v1/users/:userId
 * Update user (admin or own user)
 * Access: Admin or Own user
 */
router.put("/:userId", updateUserController);

/**
 * DELETE /api/v1/users/:userId
 * Delete user (admin only)
 * Access: Admin only
 */
router.delete("/:userId", deleteUserController);

export default router;
