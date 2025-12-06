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

    if (req.user.role !== "admin" && req.user.id !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
      return;
    }

    const { name, email, phone, role } = req.body;

    if (!name && !email && !phone && !role) {
      res.status(400).json({
        success: false,
        message:
          "Provide at least one field to update (name, email, phone, or role)",
      });
      return;
    }

    // Non-admins cannot change roles
    let finalRole = role;
    if (role && req.user.role !== "admin") {
      finalRole = undefined; // Ignore role field for non-admins
    }

    if (finalRole && !["admin", "customer"].includes(finalRole)) {
      res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'customer'",
      });
      return;
    }

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

    const result = await updateUserService(userId, {
      name,
      email,
      phone,
      role: finalRole,
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

    if (req.user.role !== "admin" && req.user.id !== userId) {
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
