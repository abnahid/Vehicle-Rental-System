import pool from "../../../database/connection.js";

export const postVehiclesService = async (vehicleData: {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}) => {
  try {
    const query = `
      INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `;

    const result = await pool.query(query, [
      vehicleData.vehicle_name,
      vehicleData.type,
      vehicleData.registration_number,
      vehicleData.daily_rent_price,
      vehicleData.availability_status,
    ]);

    return {
      success: true,
      message: "Vehicle added successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};

export const getVehiclesService = async () => {
  try {
    const query = `
      SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
      FROM vehicles
      ORDER BY id DESC
    `;

    const result = await pool.query(query);

    return {
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    };
  } catch (error) {
    throw error;
  }
};

export const getVehicleByIdService = async (vehicleId: number) => {
  try {
    const query = `
      SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
      FROM vehicles
      WHERE id = $1
    `;

    const result = await pool.query(query, [vehicleId]);

    if (result.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    return {
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};

export const updateVehicleService = async (
  vehicleId: number,
  updateData: {
    vehicle_name?: string;
    type?: string;
    registration_number?: string;
    daily_rent_price?: number;
    availability_status?: string;
  }
) => {
  try {
    const query = `
      UPDATE vehicles
      SET vehicle_name = COALESCE($1, vehicle_name),
          type = COALESCE($2, type),
          registration_number = COALESCE($3, registration_number),
          daily_rent_price = COALESCE($4, daily_rent_price),
          availability_status = COALESCE($5, availability_status)
      WHERE id = $6
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `;

    const result = await pool.query(query, [
      updateData.vehicle_name,
      updateData.type,
      updateData.registration_number,
      updateData.daily_rent_price,
      updateData.availability_status,
      vehicleId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    return {
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};

export const deleteVehicleService = async (vehicleId: number) => {
  try {
    const query = `
      DELETE FROM vehicles
      WHERE id = $1
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `;

    const result = await pool.query(query, [vehicleId]);

    if (result.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    return {
      success: true,
      message: "Vehicle deleted successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};
