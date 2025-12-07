export const getSwaggerSpec = (baseUrl: string) => {
  return {
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
        url: baseUrl,
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
          description: "Check if API is running",
          responses: {
            "200": {
              description: "API is running",
            },
          },
        },
      },
      "/api/v1/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
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
                    password: { type: "string", example: "password123" },
                    phone: { type: "string", example: "+1234567890" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "User registered successfully" },
            "400": { description: "Validation error" },
          },
        },
      },
      "/api/v1/auth/signin": {
        post: {
          tags: ["Authentication"],
          summary: "Login and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "maya.t@example.com" },
                    password: { type: "string", example: "MySecurePass99" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login successful" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/v1/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Users retrieved successfully" },
            "403": { description: "Only admins can view all users" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/users/{userId}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
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
            "200": { description: "User retrieved successfully" },
            "403": { description: "You can only view your own profile" },
            "401": { description: "Authentication required" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user",
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
            "200": { description: "User updated successfully" },
            "403": { description: "You can only update your own profile" },
            "401": { description: "Authentication required" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
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
            "200": { description: "User deleted successfully" },
            "403": { description: "Only admins can delete users" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/vehicles": {
        get: {
          tags: ["Vehicles"],
          summary: "Get all vehicles",
          responses: {
            "200": { description: "Vehicles retrieved successfully" },
          },
        },
        post: {
          tags: ["Vehicles"],
          summary: "Add new vehicle",
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
                    },
                    registration_number: { type: "string" },
                    daily_rent_price: { type: "number" },
                    availability_status: {
                      type: "string",
                      enum: ["available", "booked"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Vehicle added successfully" },
            "403": { description: "Only admins can add vehicles" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/vehicles/{vehicleId}": {
        get: {
          tags: ["Vehicles"],
          summary: "Get vehicle by ID",
          parameters: [
            {
              in: "path",
              name: "vehicleId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            "200": { description: "Vehicle retrieved successfully" },
            "404": { description: "Vehicle not found" },
          },
        },
        put: {
          tags: ["Vehicles"],
          summary: "Update vehicle",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "vehicleId",
              required: true,
              schema: { type: "integer" },
            },
          ],
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
                    vehicle_name: { type: "string" },
                    type: {
                      type: "string",
                      enum: ["car", "bike", "van", "SUV"],
                    },
                    registration_number: { type: "string" },
                    daily_rent_price: { type: "number" },
                    availability_status: {
                      type: "string",
                      enum: ["available", "booked"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Vehicle updated successfully" },
            "403": { description: "Only admins can update vehicles" },
            "401": { description: "Authentication required" },
          },
        },
        delete: {
          tags: ["Vehicles"],
          summary: "Delete vehicle",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "vehicleId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            "200": { description: "Vehicle deleted successfully" },
            "403": { description: "Only admins can delete vehicles" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/bookings": {
        post: {
          tags: ["Bookings"],
          summary: "Create a new booking",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["vehicle_id", "rent_start_date", "rent_end_date"],
                  properties: {
                    vehicle_id: { type: "integer" },
                    rent_start_date: { type: "string", format: "date" },
                    rent_end_date: { type: "string", format: "date" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Booking created successfully" },
            "400": { description: "Invalid booking request" },
            "401": { description: "Authentication required" },
          },
        },
        get: {
          tags: ["Bookings"],
          summary: "Get all bookings",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Bookings retrieved successfully" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/bookings/{bookingId}": {
        get: {
          tags: ["Bookings"],
          summary: "Get booking by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "bookingId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            "200": { description: "Booking retrieved successfully" },
            "403": { description: "You can only view your own bookings" },
            "401": { description: "Authentication required" },
          },
        },
        put: {
          tags: ["Bookings"],
          summary: "Update booking status",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "bookingId",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: ["cancelled", "returned"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Booking updated successfully" },
            "400": { description: "Invalid request" },
            "401": { description: "Authentication required" },
          },
        },
      },
      "/api/v1/bookings/status/auto-complete": {
        get: {
          tags: ["Bookings"],
          summary: "Auto-complete expired bookings",
          description: "Marks bookings with passed rent_end_date as returned",
          responses: {
            "200": { description: "Expired bookings processed successfully" },
            "500": { description: "Error processing bookings" },
          },
        },
      },
    },
  };
};
