import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../../database/connection.js";

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}

interface SigninData {
  email: string;
  password: string;
}

export const signupService = async (data: SignupData) => {
  try {
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [
      data.email.toLowerCase(),
    ]);

    if (emailCheckResult.rows.length > 0) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const insertQuery = `
      INSERT INTO users (name, email, password, phone, role, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, name, email, phone, role
    `;

    const result = await pool.query(insertQuery, [
      data.name,
      data.email.toLowerCase(),
      hashedPassword,
      data.phone,
      data.role || "customer",
    ]);

    return {
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    };
  } catch (error) {
    throw error;
  }
};

export const signinService = async (data: SigninData) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [data.email.toLowerCase()]);

    if (result.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not configured");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};
