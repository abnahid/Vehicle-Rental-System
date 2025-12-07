import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getSwaggerSpec } from "./config/swagger.config.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import bookingsRoutes from "./modules/bookings/routes/bookings.routes.js";
import usersRoutes from "./modules/users/routes/users.routes.js";
import vehiclesRoutes from "./modules/vehicles/routes/vehicles.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

//  Swagger config
const swaggerSpec = getSwaggerSpec(BASE_URL);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api-spec.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

app.get("/docs", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Vehicle Rental System API is running",
    version: "1.0.0",
    docs: `${BASE_URL}/docs`,
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

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
