import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "./docs/swagger.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import usersRoutes from "./modules/users/routes/users.routes.js";
import vehiclesRoutes from "./modules/vehicles/routes/vehicles.routes.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Rental System API",
      version: "1.0.0",
      description:
        "Backend API for vehicle rental management system by abnahid ",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: BASE_URL,
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/swagger.ts", "./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger documentation route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
