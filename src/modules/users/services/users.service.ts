import pool from "../../../database/connection.js";

export const getAllUsersService = async () => {
  try {
    const query = `
      SELECT id, name, email, phone, role
      FROM users
      ORDER BY id DESC
    `;

    const result = await pool.query(query);

    return {
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    };
  } catch (error) {
    throw error;
  }
};

export const updateUserService = async (
  userId: number,
  updateData: {
    name?: string;
    email?: string;
    phone?: string;
    role?: "admin" | "customer";
  }
) => {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updateData.name.trim());
    }

    if (updateData.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(updateData.email.trim().toLowerCase());
    }

    if (updateData.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(updateData.phone.trim());
    }

    if (updateData.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(updateData.role);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = NOW()`);

    values.push(userId);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, role
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUserService = async (userId: number) => {
  try {
    const checkBookingsQuery = `
      SELECT COUNT(*) as count
      FROM bookings
      WHERE customer_id = $1 AND status = 'active'
    `;

    const bookingsResult = await pool.query(checkBookingsQuery, [userId]);
    const activeBookingsCount = parseInt(bookingsResult.rows[0].count, 10);

    if (activeBookingsCount > 0) {
      throw new Error(
        `Cannot delete user with ${activeBookingsCount} active booking(s)`
      );
    }

    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(deleteQuery, [userId]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const getUserByIdService = async (userId: number) => {
  try {
    const query = `
      SELECT id, name, email, phone, role
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};
