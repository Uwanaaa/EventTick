// POST /super-admin -> Create super admin
// ●​ POST /admin/block-user/{id} → Block a user(prevents login & access)
// ●​ POST /admin/unblock-user/{id} → Unblock a user(restores access)
// ●​ DELETE /admin/delete-user/{id} → Permanently delete a user

import express from "express";
import { createAdmin, createSuperAdmin, blockUser, unblockUser, deleteUser, deleteAdmin, getAllAdmin, loginAdmin } from "../controllers/adminController.js";


export const adminRouter = express.Router();


adminRouter.post("/register-super-admin", createSuperAdmin);


/**
 * @swagger
 * /api/v1/admin/super/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
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

adminRouter.post("/super/login", loginAdmin);


/**
 * @swagger
 * /api/v1/admin/register-admin:
 *   post:
 *     summary: Register a new admin accout
 *     description: Create a new admin account. Restricted to only Super Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreate'
 *     responses:
 *       201:
 *         description: Admin account created  successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCreate'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/register-admin", createAdmin);


/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
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


adminRouter.post("/login", loginAdmin)

/**
 * @swagger
 * /api/v1/admin/:
 *   get:
 *     summary: get all admin accounts
 *     description: get all admin account. Restricted to only Super Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Admin account retrieved  successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCreate'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

adminRouter.get("/", getAllAdmin);


/**
 * @swagger
 * /api/v1/admin/{id}:
 *   delete:
 *     summary: Delete an admin account
 *     description: Delete an admin  with the specified ID. Restricted to only super admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin account has been deleted successfully
 *       401:
 *         description: Unauthorized. User not authenticated
 *       403:
 *         description: Forbidden. User does not have super admin or admin privileges
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

adminRouter.delete("/:id", deleteAdmin);



/**
 * @swagger
 * /api/v1/admin/block-user/{ id }:
 *  put:
 *    summary: Block User
 *    description: Block User specified by the ID. Restricted to Admin or Super Admin
 *    tags: [Admin]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user to block
 *        schema:
 *          type: string
 *          format: objectId
 *    response:
 *      200:
 *        description: Successfully blocked user
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: User account has been blocked successfully
 *      404:
 *        description: User not found
 *      401:
 *        description: Unauthorized. User not authenticated
 *      403:
 *        description: Forbidden. User does not have admin or super admin privileges
 *      500:
 *        description: Internal server error
 */
adminRouter.put("/block-user/:id", blockUser);

/**
 * @swagger
 * /api/v1/admin/unblock-user/{id}:
 *   put:
 *     summary: Unblock a user
 *     description: Unblock a user with the specified ID. Restricted to admin or super admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to unblock
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Successfully unblocked the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account has been unblocked successfully
 *       401:
 *         description: Unauthorized. User not authenticated
 *       403:
 *         description: Forbidden. User does not have super admin or admin privileges
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

adminRouter.put("/unblock-user/:id", unblockUser);
/**
 * @swagger
 * /api/v1/admin/delete-user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user with the specified ID. Restricted to admin or super admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account has been deleted successfully
 *       401:
 *         description: Unauthorized. User not authenticated
 *       403:
 *         description: Forbidden. User does not have super admin or admin privileges
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete('/delete-user/:id', deleteUser);



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AdminCreate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         name:
 *           type: string
 *           description: User name
 *         gender:
 *           type: string
 *           enum: ["male", "female", "others"]
 *           description: User gender
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "blocked"]
 *           description: User account status
 *         role:
 *           type: string
 *           enum: ["user", "admin", "superAdmin"]
 *           description: User role
 *       example:
 *         _id: 67be07eeb54ccfa49e8550b9
 *         name: John Doe
 *         email: john@example.com
 *         phone: "0332334433"
 *         gender: male
 *         status: active
 *         role: user
 *     AdminLogin:
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
 */
