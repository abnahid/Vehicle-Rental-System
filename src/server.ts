import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import usersRoutes from "./modules/users/routes/users.routes.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Vehicle Rental System API is running",
    version: "1.0.0",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📖 API Documentation: http://localhost:${port}`);
});

export default app;
