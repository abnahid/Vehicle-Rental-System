/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - API Info
 *     summary: API Health Check
 *     description: |
 *       **🔐 TEST CREDENTIALS FOR ADMIN ACCESS:**
 *
 *       Email: maya.t@example.com
 *       Password: MySecurePass99
 *
 *       **HOW TO USE:**
 *       1. Go to POST /api/v1/auth/signin
 *       2. Click on "Try it out" and "Execute"
 *       3. Copy the "token" from the response
 *       4. For any endpoint requiring authentication:
 *          - Click "Authorize" button (top right)
 *          - Paste the token as: Bearer {token}
 *       5. Now you can test all admin-only endpoints
 *     responses:
 *       200:
 *         description: API is running
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user account
 *     description: Creates a new user account. New users are always created as 'customer' role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login and receive JWT token
 *     description: Authenticates user with email and password, returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: maya.t@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePass99
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Only admins can view all users
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve user details (Admin can view any user, customers can view only their own)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       403:
 *         description: You can only view your own profile
 *       401:
 *         description: Authentication required
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Update user details (Admins can change any field, customers can only update own profile)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, customer]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: You can only update your own profile
 *       401:
 *         description: Authentication required
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Delete a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Only admins can delete users
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Get all vehicles
 *     description: Retrieve all vehicles (Public endpoint)
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *   post:
 *     tags:
 *       - Vehicles
 *     summary: Add new vehicle
 *     description: Create a new vehicle (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_name
 *               - type
 *               - registration_number
 *               - daily_rent_price
 *               - availability_status
 *             properties:
 *               vehicle_name:
 *                 type: string
 *                 example: Honda Civic 2023
 *               type:
 *                 type: string
 *                 enum: [car, bike, van, SUV]
 *                 example: car
 *               registration_number:
 *                 type: string
 *                 example: DHA-4521
 *               daily_rent_price:
 *                 type: number
 *                 example: 48
 *               availability_status:
 *                 type: string
 *                 enum: [available, booked]
 *                 example: available
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       403:
 *         description: Only admins can add vehicles
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/v1/vehicles/{vehicleId}:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Get vehicle by ID
 *     description: Retrieve specific vehicle details (Public endpoint)
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 *   put:
 *     tags:
 *       - Vehicles
 *     summary: Update vehicle
 *     description: Update vehicle details (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_name
 *               - type
 *               - registration_number
 *               - daily_rent_price
 *               - availability_status
 *             properties:
 *               vehicle_name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [car, bike, van, SUV]
 *               registration_number:
 *                 type: string
 *               daily_rent_price:
 *                 type: number
 *               availability_status:
 *                 type: string
 *                 enum: [available, booked]
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       403:
 *         description: Only admins can update vehicles
 *       401:
 *         description: Authentication required
 *   delete:
 *     tags:
 *       - Vehicles
 *     summary: Delete vehicle
 *     description: Delete a vehicle (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       403:
 *         description: Only admins can delete vehicles
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     description: Create a booking for a vehicle. Validates availability and calculates total price.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - rent_start_date
 *               - rent_end_date
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *                 example: 2
 *               rent_start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               rent_end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking request
 *       404:
 *         description: Vehicle not found
 *       401:
 *         description: Authentication required
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get all bookings
 *     description: Retrieve bookings. Admins see all, customers see only their own.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/v1/bookings/status/auto-complete:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Auto-complete expired bookings
 *     description: Marks all bookings with passed rent_end_date as "returned" and updates vehicle availability.
 *     responses:
 *       200:
 *         description: Expired bookings processed successfully
 *       500:
 *         description: Error processing bookings
 */

/**
 * @swagger
 * /api/v1/bookings/{bookingId}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get booking by ID
 *     description: Retrieve booking details. Customers can only view their own bookings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       403:
 *         description: You can only view your own bookings
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Authentication required
 *   put:
 *     tags:
 *       - Bookings
 *     summary: Update booking status
 *     description: |
 *       Update booking status.
 *       - Customers can only cancel their own bookings
 *       - Admins can mark as "returned" (makes vehicle available) or "cancelled"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [cancelled, returned]
 *                 example: "cancelled"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not authorized to update this booking
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Authentication required
 */

export {};
