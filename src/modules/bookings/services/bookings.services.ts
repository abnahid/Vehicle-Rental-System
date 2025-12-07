import pool from "../../../database/connection.js";

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export const postBookingsService = async (bookingData: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
}) => {
  try {
    const query = `
      INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `;

    const result = await pool.query(query, [
      bookingData.customer_id,
      bookingData.vehicle_id,
      bookingData.rent_start_date,
      bookingData.rent_end_date,
      bookingData.total_price,
    ]);

    const row = result.rows[0];
    return {
      success: true,
      message: "Booking added successfully",
      data: {
        ...row,
        rent_start_date: formatDate(row.rent_start_date),
        rent_end_date: formatDate(row.rent_end_date),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getBookingsService = async (userId: number, role: string) => {
  try {
    let query = `
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, 
             b.total_price, b.status, v.vehicle_name, v.daily_rent_price, v.registration_number, v.type, c.name, c.email
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users c ON b.customer_id = c.id
    `;

    if (role !== "admin") {
      query += ` WHERE b.customer_id = $1`;
    }

    query += ` ORDER BY b.id DESC`;

    const result =
      role === "admin"
        ? await pool.query(query)
        : await pool.query(query, [userId]);

    return {
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result.rows.map((row) => {
        if (role !== "admin") {
          return {
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: formatDate(row.rent_start_date),
            rent_end_date: formatDate(row.rent_end_date),
            total_price: row.total_price,
            status: row.status,
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.registration_number,
              type: row.type,
            },
          };
        }

        return {
          id: row.id,
          customer_id: row.customer_id,
          vehicle_id: row.vehicle_id,
          rent_start_date: formatDate(row.rent_start_date),
          rent_end_date: formatDate(row.rent_end_date),
          total_price: row.total_price,
          status: row.status,
          customer: {
            name: row.name,
            email: row.email,
          },
          vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type,
          },
        };
      }),
    };
  } catch (error) {
    throw error;
  }
};

export const getBookingByIdService = async (
  bookingId: number,
  userId: number,
  role: string
) => {
  try {
    const query = `
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, 
             b.total_price, b.status, v.vehicle_name, v.daily_rent_price, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = $1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rows.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = result.rows[0];

    // Check authorization: customers can only view their own bookings
    if (role !== "admin" && booking.customer_id !== userId) {
      throw new Error("You can only view your own bookings");
    }

    // For customers, exclude customer_id
    if (role !== "admin") {
      return {
        success: true,
        message: "Booking retrieved successfully",
        data: {
          id: booking.id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: formatDate(booking.rent_start_date),
          rent_end_date: formatDate(booking.rent_end_date),
          total_price: booking.total_price,
          status: booking.status,
          vehicle: {
            vehicle_name: booking.vehicle_name,
            daily_rent_price: booking.daily_rent_price,
            type: booking.type,
          },
        },
      };
    }

    // For admins, include customer_id
    return {
      success: true,
      message: "Booking retrieved successfully",
      data: {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: formatDate(booking.rent_start_date),
        rent_end_date: formatDate(booking.rent_end_date),
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: booking.vehicle_name,
          daily_rent_price: booking.daily_rent_price,
          type: booking.type,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const updateBookingService = async (
  bookingId: number,
  userId: number,
  role: string,
  newStatus: string
) => {
  try {
    if (!["active", "cancelled", "returned"].includes(newStatus)) {
      throw new Error(
        "Invalid status. Must be 'active', 'cancelled', or 'returned'"
      );
    }

    // Get current booking
    const getQuery = `
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, 
             b.total_price, b.status, v.availability_status
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = $1
    `;
    const getResult = await pool.query(getQuery, [bookingId]);

    if (getResult.rows.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = getResult.rows[0];

    if (role !== "admin" && booking.customer_id !== userId) {
      throw new Error("You can only update your own bookings");
    }

    if (role !== "admin" && newStatus !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    if (
      role === "admin" &&
      newStatus !== "returned" &&
      newStatus !== "cancelled"
    ) {
      throw new Error("Admins can only mark as 'returned' or 'cancelled'");
    }

    const updateQuery = `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `;
    const updateResult = await pool.query(updateQuery, [newStatus, bookingId]);
    const updatedBooking = updateResult.rows[0];

    let message = "";
    let responseData: any = {
      id: updatedBooking.id,
      customer_id: updatedBooking.customer_id,
      vehicle_id: updatedBooking.vehicle_id,
      rent_start_date: formatDate(updatedBooking.rent_start_date),
      rent_end_date: formatDate(updatedBooking.rent_end_date),
      total_price: updatedBooking.total_price,
      status: updatedBooking.status,
    };

    if (newStatus === "cancelled") {
      message = "Booking cancelled successfully";
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
      responseData.vehicle = {
        availability_status: "available",
      };
    } else if (newStatus === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
      responseData.vehicle = {
        availability_status: "available",
      };
    }

    return {
      success: true,
      message,
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
};

export const autoCompleteExpiredBookingsService = async () => {
  try {
    const query = `
      SELECT b.id, b.vehicle_id, b.rent_end_date, b.status
      FROM bookings b
      WHERE b.status = 'active' 
      AND b.rent_end_date < NOW()::date
    `;

    const result = await pool.query(query);
    const expiredBookings = result.rows;

    if (expiredBookings.length === 0) {
      return {
        success: true,
        message: "No expired bookings to update",
        data: {
          updated_count: 0,
          bookings: [],
        },
      };
    }

    const updatedBookings = [];

    for (const booking of expiredBookings) {
      const updateBookingQuery = `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
        RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
      `;
      const bookingResult = await pool.query(updateBookingQuery, [booking.id]);
      const updatedBooking = bookingResult.rows[0];

      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );

      updatedBookings.push({
        id: updatedBooking.id,
        customer_id: updatedBooking.customer_id,
        vehicle_id: updatedBooking.vehicle_id,
        rent_start_date: formatDate(updatedBooking.rent_start_date),
        rent_end_date: formatDate(updatedBooking.rent_end_date),
        total_price: updatedBooking.total_price,
        status: updatedBooking.status,
      });
    }

    return {
      success: true,
      message: `${updatedBookings.length} expired booking(s) marked as returned and vehicle(s) made available`,
      data: {
        updated_count: updatedBookings.length,
        bookings: updatedBookings,
      },
    };
  } catch (error) {
    throw error;
  }
};
