import { Request, Response } from "express";
import {
  deleteVehicleService,
  getVehicleByIdService,
  getVehiclesService,
  postVehiclesService,
  updateVehicleService,
} from "../services/vehicles.service.js";

export const postVehiclesController = async (
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
        message: "Only admins can add vehicles",
      });
      return;
    }

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !daily_rent_price ||
      !availability_status
    ) {
      res.status(400).json({
        success: false,
        message:
          "All fields are required (vehicle_name, type, registration_number, daily_rent_price, availability_status)",
      });
      return;
    }

    if (!["car", "bike", "van", "SUV"].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be one of: car, bike, van, SUV",
      });
      return;
    }

    if (!["available", "booked"].includes(availability_status)) {
      res.status(400).json({
        success: false,
        message: "Availability status must be either 'available' or 'booked'",
      });
      return;
    }

    if (daily_rent_price <= 0) {
      res.status(400).json({
        success: false,
        message: "Daily rent price must be greater than 0",
      });
      return;
    }

    const result = await postVehiclesService({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error adding vehicle";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getVehiclesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getVehiclesService();
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching vehicles";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getVehicleByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicleId, 10);

    if (isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
      return;
    }

    const result = await getVehicleByIdService(vehicleId);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching vehicle";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateVehicleController = async (req: Request, res: Response) => {
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
        message: "Only admins can update vehicles",
      });
      return;
    }

    const vehicleId = parseInt(req.params.vehicleId, 10);

    if (isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
      return;
    }

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !daily_rent_price ||
      !availability_status
    ) {
      res.status(400).json({
        success: false,
        message:
          "All fields are required (vehicle_name, type, registration_number, daily_rent_price, availability_status)",
      });
      return;
    }

    if (!["car", "bike", "van", "SUV"].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be one of: car, bike, van, SUV",
      });
      return;
    }

    if (!["available", "booked"].includes(availability_status)) {
      res.status(400).json({
        success: false,
        message: "Availability status must be either 'available' or 'booked'",
      });
      return;
    }

    if (daily_rent_price <= 0) {
      res.status(400).json({
        success: false,
        message: "Daily rent price must be greater than 0",
      });
      return;
    }

    const result = await updateVehicleService(vehicleId, {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error updating vehicle";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const deleteVehicleController = async (req: Request, res: Response) => {
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
        message: "Only admins can update vehicles",
      });
      return;
    }

    const vehicleId = parseInt(req.params.vehicleId, 10);

    if (isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
      return;
    }
    const result = await deleteVehicleService(vehicleId);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error deleting vehicle";

    res.status(500).json({
      success: false,
      message,
    });
  }
};
