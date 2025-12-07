import { Request, Response } from "express";
import pool from "../../../database/connection.js";
import {
  autoCompleteExpiredBookingsService,
  getBookingByIdService,
  getBookingsService,
  postBookingsService,
  updateBookingService,
} from "../services/bookings.services.js";

export const postBookingsController = async (
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

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (!vehicle_id || !rent_start_date || !rent_end_date) {
      res.status(400).json({
        success: false,
        message:
          "All fields are required (vehicle_id, rent_start_date, rent_end_date`)",
      });
      return;
    }

    // Validate dates
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
      return;
    }

    if (endDate <= startDate) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
      return;
    }

    // Check vehicle exists and get daily rate
    const vehicleQuery = `
      SELECT id, vehicle_name, daily_rent_price, availability_status 
      FROM vehicles 
      WHERE id = $1
    `;
    const vehicleResult = await pool.query(vehicleQuery, [vehicle_id]);

    if (vehicleResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
      return;
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status === "booked") {
      res.status(400).json({
        success: false,
        message: "Vehicle is not available for booking",
      });
      return;
    }

    // Calculate total price
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const total_price = days * vehicle.daily_rent_price;

    // Create booking and update vehicle status
    const result = await postBookingsService({
      customer_id: req.user.id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
    });

    // Update vehicle availability status
    await pool.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        id: result.data.id,
        customer_id: result.data.customer_id,
        vehicle_id: result.data.vehicle_id,
        rent_start_date: result.data.rent_start_date,
        rent_end_date: result.data.rent_end_date,
        total_price,
        status: "active",
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating booking";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getBookingsController = async (
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

    const result = await getBookingsService(req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching bookings";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getBookingUpdateByIdController = async (
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

    const bookingId = parseInt(req.params.bookingId, 10);

    if (isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const result = await getBookingByIdService(
      bookingId,
      req.user.id,
      req.user.role
    );
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching booking";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateBookingController = async (
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

    const bookingId = parseInt(req.params.bookingId, 10);

    if (isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Status is required",
      });
      return;
    }

    const result = await updateBookingService(
      bookingId,
      req.user.id,
      req.user.role,
      status
    );

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error updating booking";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const autoCompleteExpiredBookingsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await autoCompleteExpiredBookingsService();
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error auto-completing bookings";

    res.status(500).json({
      success: false,
      message,
    });
  }
};
