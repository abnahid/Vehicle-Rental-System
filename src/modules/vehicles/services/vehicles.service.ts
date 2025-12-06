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
