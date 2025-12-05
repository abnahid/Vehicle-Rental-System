import { Request, Response } from "express";
import {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/users.service.js";

export const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can view all users",
      });
      return;
    }

    // Call service
    const result = await getAllUsersService();
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching users";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

/**
 * UPDATE USER CONTROLLER
 * Endpoint: PUT /api/v1/users/:userId
 * Access: Admin or Own user
 * Description: Admin can update any user, customer can update own profile
 */
export const updateUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const userId = parseInt(req.params.userId, 10);

    // Authorization: Admin or own user
    if (req.user.role !== "admin" && req.user.id !== String(userId)) {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
      return;
    }

    const { name, email, phone, role } = req.body;

    // Validation: At least one field to update
    if (!name && !email && !phone && !role) {
      res.status(400).json({
        success: false,
        message:
          "Provide at least one field to update (name, email, phone, or role)",
      });
      return;
    }

    // Validation: If role provided, only admin can change it
    if (role && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can change user roles",
      });
      return;
    }

    // Validation: If role provided, check it's valid
    if (role && !["admin", "customer"].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'customer'",
      });
      return;
    }

    // Validation: If email provided, check format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
        return;
      }
    }

    // Call service
    const result = await updateUserService(userId, {
      name,
      email,
      phone,
      role,
    });

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error updating user";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

/**
 * DELETE USER CONTROLLER
 * Endpoint: DELETE /api/v1/users/:userId
 * Access: Admin only
 * Description: Delete user (only if no active bookings exist)
 */
export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Authorization: Admin only
    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can delete users",
      });
      return;
    }

    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    // Call service
    const result = await deleteUserService(userId);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error deleting user";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

/**
 * GET USER BY ID CONTROLLER
 * Endpoint: GET /api/v1/users/:userId
 * Access: Admin or Own user
 * Description: View specific user details
 */
export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const userId = parseInt(req.params.userId, 10);

    // Authorization: Admin or own user
    if (req.user.role !== "admin" && req.user.id !== String(userId)) {
      res.status(403).json({
        success: false,
        message: "You can only view your own profile",
      });
      return;
    }

    // Call service
    const result = await getUserByIdService(userId);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching user";

    res.status(400).json({
      success: false,
      message,
    });
  }
};
