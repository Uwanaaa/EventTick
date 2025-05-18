/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: Invalidate the user's JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Generate an OTP and send it to the provided email for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: user email address
 *     responses:
 *       200:
 *         description: Check your mail
 *       404:
 *         description: Invalid email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verify OTP and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email for verification
 *               otp:
 *                 type: string
 *                 description: the otp
 *     responses:
 *       200:
 *         description: Successfully verified OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: Invalid email
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset a password
 *     description: Reset the password of the user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/get-otp:
 *   post:
 *     summary: Get OTP
 *     description: Get an OTP for verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: user email address
 *     responses:
 *       200:
 *         description: Check your mail
 *       404:
 *         description: Invalid email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/verify-account:
 *   post:
 *     summary: Account verification
 *     description: Verify user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: user email address
 *               otp:
 *                 type: string
 *                 description: OTP sent to email
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *         phone:
 *           type: string
 *           description: user phone number
 *         gender:
 *           type: string
 *           enum: ["male", "female", "others"]
 *           description: user gender
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: user date of birth
 *         address:
 *           type: string
 *           description: user address location
 *         latitude:
 *           type: number
 *           description: user latitude location coordinate
 *         longitude:
 *           type: number
 *           description: user longitude location coordinate
 *         bio:
 *           type: string
 *           description: user bio
 *         occupation:
 *           type: string
 *           description: user occupation
 *         country:
 *           type: string
 *           description: user country
 *         degree:
 *           type: string
 *           description: user degree
 *         religion:
 *           type: string
 *           description: user religion
 *         marital_status:
 *           type: string
 *           description: user marital status
 *       required:
 *         - name
 *         - email
 *         - password
 *         - gender
 *         - date_of_birth
 *         - address
 *         - latitude
 *         - longitude
 *         - bio
 *         - occupation
 *         - country
 *         - degree
 *         - religion
 *         - marital_status
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password: password123
 *         gender: male
 *         date_of_birth: 2025-04-20
 *         address: 203, aaa London
 *         latitude: 30.4
 *         longitude: 54.1
 *         bio: I am human
 *         occupation: Engineer
 *         country: Nigeria
 *         degree: BSc
 *         religion: Christian
 *         marital_status: Single
 *
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *       required:
 *         - email
 *         - password
 *       example:
 *         email: john@example.com
 *         password: password123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: user id
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         name:
 *           type: string
 *           description: user name
 *         phone:
 *           type: string
 *           description: User phone number
 *         gender:
 *           type: string
 *           enum: ["male", "female", "others"]
 *           description: User gender
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: User date of birth
 *         latitude:
 *           type: number
 *           description: User latitude location coordinate
 *         longitude:
 *           type: number
 *           description: User longitude location coordinate
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "blocked"]
 *           description: user account status
 *         role:
 *           type: string
 *           enum: ["user", "admin", "superAdmin"]
 *           description: user role
 *         bio:
 *           type: string
 *           description: user bio
 *         occupation:
 *           type: string
 *           description: user occupation
 *         country:
 *           type: string
 *           description: user country
 *         degree:
 *           type: string
 *           description: user degree
 *         religion:
 *           type: string
 *           description: user religion
 *         marital_status:
 *           type: string
 *           description: user marital status
 *         token:
 *           type: string
 *           description: JWT token
 *       example:
 *         _id: 67be07eeb54ccfa49e8550b9
 *         name: John Doe
 *         email: john@example.com
 *         phone: 0332334433
 *         gender: male
 *         date_of_birth: 2025-02-24
 *         latitude: 40
 *         longitude: 23.2
 *         status: active
 *         role: user
 *         bio: The boy is good
 *         occupation: Engineer
 *         country: Nigeria
 *         degree: BSc
 *         religion: Christian
 *         marital_status: Single
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmUwN2VlYjU0Y2NmYTQ5ZTg1NTBiOSIsImlhdCI6MTc0MDUwNzIxNiwiZXhwIjoxNzQzMDk5MjE2fQ.y7PLMY5kH8pcgWt6HeNcuKzoBN5qaN0uKtyxLaLIYfD
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
