import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import usersRoutes from "./modules/users/routes/users.routes.js";
import vehiclesRoutes from "./modules/vehicles/routes/vehicles.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Swagger configuration with full documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Rental System API",
      version: "1.0.0",
      description:
        "Backend API for vehicle rental management system by abnahid",
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
    paths: {
      "/": {
        get: {
          tags: ["API Info"],
          summary: "API Health Check",
          description: `**🔐 TEST CREDENTIALS FOR ADMIN ACCESS:**\n\nEmail: maya.t@example.com\nPassword: MySecurePass99\n\n**HOW TO USE:**\n1. Go to POST /api/v1/auth/signin\n2. Click on "Login" example\n3. Click "Try it out" and "Execute"\n4. Copy the "token" from response\n5. Click "Authorize" button (top right)\n6. Paste token as: Bearer {token}\n7. Test all admin-only endpoints`,
          responses: {
            200: {
              description: "API is running",
            },
          },
        },
      },
      "/api/v1/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user account",
          description:
            "Creates a new user account. New users are always created as 'customer' role.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password", "phone"],
                  properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", example: "john@example.com" },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "password123",
                    },
                    phone: { type: "string", example: "+1234567890" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
            },
            400: {
              description: "Validation error",
            },
          },
        },
      },
      "/api/v1/auth/signin": {
        post: {
          tags: ["Authentication"],
          summary: "Login and receive JWT token",
          description:
            "Authenticates user with email and password, returns JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "john@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/api/v1/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          description: "Retrieve all users in the system (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Users retrieved successfully",
            },
            403: {
              description: "Only admins can view all users",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
      },
      "/api/v1/users/{userId}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
          description:
            "Retrieve user details (Admin can view any user, customers can view only their own)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "userId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "User retrieved successfully",
            },
            403: {
              description: "You can only view your own profile",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user",
          description:
            "Update user details. Admins can change any field. Customers can only update own profile.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "userId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    role: { type: "string", enum: ["admin", "customer"] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User updated successfully",
            },
            403: {
              description: "You can only update your own profile",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
          description:
            "Delete a user (Admin only, cannot delete if user has active bookings)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "userId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "User deleted successfully",
            },
            403: {
              description: "Only admins can delete users",
            },
            400: {
              description: "Cannot delete user with active bookings",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
      },
      "/api/v1/vehicles": {
        get: {
          tags: ["Vehicles"],
          summary: "Get all vehicles",
          description: "Retrieve all vehicles in the system (Public endpoint)",
          responses: {
            200: {
              description: "Vehicles retrieved successfully",
            },
          },
        },
        post: {
          tags: ["Vehicles"],
          summary: "Add new vehicle",
          description: "Create a new vehicle (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "vehicle_name",
                    "type",
                    "registration_number",
                    "daily_rent_price",
                    "availability_status",
                  ],
                  properties: {
                    vehicle_name: {
                      type: "string",
                      example: "Honda Civic 2023",
                    },
                    type: {
                      type: "string",
                      enum: ["car", "bike", "van", "SUV"],
                      example: "car",
                    },
                    registration_number: {
                      type: "string",
                      example: "DHA-4521",
                    },
                    daily_rent_price: { type: "number", example: 48 },
                    availability_status: {
                      type: "string",
                      enum: ["available", "booked"],
                      example: "available",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Vehicle added successfully",
            },
            403: {
              description: "Only admins can add vehicles",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
      },
      "/api/v1/vehicles/{vehicleId}": {
        get: {
          tags: ["Vehicles"],
          summary: "Get vehicle by ID",
          description: "Retrieve specific vehicle details (Public endpoint)",
          parameters: [
            {
              in: "path",
              name: "vehicleId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Vehicle retrieved successfully",
            },
            500: {
              description: "Error fetching vehicle",
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve the OpenAPI spec as JSON
app.get("/api-spec.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// Serve Swagger UI HTML
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
