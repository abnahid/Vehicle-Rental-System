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
 *       2. Click on "Login" example in the Request Body
 *       3. Click "Try it out" and "Execute"
 *       4. Copy the "token" from the response
 *       5. For any endpoint requiring authentication:
 *          - Click "Authorize" button (top right)
 *          - Paste the token as: Bearer {token}
 *       6. Now you can test all admin-only endpoints
 *
 *       **Admin Can Access:**
 *       - POST /api/v1/vehicles (Add vehicles)
 *       - GET /api/v1/users (View all users)
 *       - PUT /api/v1/users/{id} (Update any user)
 *       - DELETE /api/v1/users/{id} (Delete users)
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
 *     description: Creates a new user account with name, email, password, and phone. New users are always created as 'customer' role.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: customer
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
 *     description: Authenticates user with email and password, returns JWT token for subsequent requests
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
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     examples:
 *       Customer Login:
 *         value:
 *           email: john@example.com
 *           password: password123
 *       Admin Login:
 *         value:
 *           email: zara.allen@example.com
 *           password: ZaraSecure456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication - use this in Authorization header as "Bearer {token}"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin, customer]
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
 *     description: Retrieve all users in the system (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
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
 *     description: Retrieve user details (Admin can view any user, customers can view only their own profile)
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
 *     description: Update user details. Admins can change any field including role. Customers can only update own profile (name, email, phone).
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
 *     description: Delete a user (Admin only, cannot delete if user has active bookings)
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
 *       400:
 *         description: Cannot delete user with active bookings
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
 *     description: Retrieve all vehicles in the system (Public endpoint, no authentication required)
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       vehicle_name:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [car, bike, van, SUV]
 *                       registration_number:
 *                         type: string
 *                       daily_rent_price:
 *                         type: number
 *                       availability_status:
 *                         type: string
 *                         enum: [available, booked]
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
 *       500:
 *         description: Error fetching vehicle
 */

/**
 * @swagger
 * /api/v1/vehicles/{vehicleId}:
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
 *                 example: Honda Civic 2024
 *               type:
 *                 type: string
 *                 enum: [car, bike, van, SUV]
 *                 example: car
 *               registration_number:
 *                 type: string
 *                 example: DHA-4521
 *               daily_rent_price:
 *                 type: number
 *                 example: 55
 *               availability_status:
 *                 type: string
 *                 enum: [available, booked]
 *                 example: available
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     vehicle_name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     registration_number:
 *                       type: string
 *                     daily_rent_price:
 *                       type: number
 *                     availability_status:
 *                       type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       403:
 *         description: Only admins can delete vehicles
 *       401:
 *         description: Authentication required
 */

export {};
