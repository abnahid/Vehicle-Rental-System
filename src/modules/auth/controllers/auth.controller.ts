import { Request, Response } from "express";
import { signinService, signupService } from "../services/auth.service.js";

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({
        success: false,
        message: "All fields (name, email, password, phone) are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
      return;
    }

    const result = await signupService({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      role: "customer",
    });

    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const signinController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await signinService({
      email: email.trim(),
      password,
    });

    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signin failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};
