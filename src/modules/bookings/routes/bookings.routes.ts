import { Router } from "express";
import { authenticateToken } from "../../../middleware/auth.middleware.js";
import {
  autoCompleteExpiredBookingsController,
  getBookingsController,
  getBookingUpdateByIdController,
  postBookingsController,
  updateBookingController,
} from "../controllers/bookings.controller.js";

const router = Router();

router.post("/", authenticateToken, postBookingsController);

router.get("/", authenticateToken, getBookingsController);

// Specific routes must come BEFORE parameter routes
router.get("/status/auto-complete", autoCompleteExpiredBookingsController);

// Parameter routes come last
router.get("/:bookingId", authenticateToken, getBookingUpdateByIdController);

router.put("/:bookingId", authenticateToken, updateBookingController);

export default router;
