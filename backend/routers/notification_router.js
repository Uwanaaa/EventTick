/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - status
 *         - message
 *         - sent_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification entry in the table
 *         user_id:
 *           type: integer
 *           description: The id of the user that recievs the notification
 *         status:
 *           type: string
 *           description: The status of the notification which can either be opened or not opened
 *         message:
 *           type: string
 *           description: The message in the notification
 *         sent_at:
 *           type: string
 *           format: date
 *           description: The date and the time the notification was sent
 *       example:
 *         id: d5fE_asz
 *         user_id: 3
 *         status: not opened
 *         message: A message has been sent to you 
 *         sent_at: 2025-03-31 09:31:00 
 *         
 *   
 */




/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The notification managment API
 * /api/v1/notificaton/delete:
 *   delete:
 *    summary: To delete a specified notification
 *    tags: [Notification]
 *    parameters:
 *       - in: query
 *         name: notification_id
 *         schema:
 *          type: string
 *          required: true
 *          description: The id of the notification
 *    responses:
 *       200:
 *         description: The notification has been deleted
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/filter/{date}:
 *   get:
 *    summary: To get notifications that fit a specified date for a user
 *    tags: [Notification]
 *    parameters:
 *     - in: path
 *       name: date
 *       schema:
 *         type: string
 *         required: true
 *         description: The date used to filter the notification
 *    responses:
 *       200:
 *         description: The list of notifications fitting the specified date
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/change-notification-status/{id}:
 *   post:
 *    summary: To update the status of the notification
 *    tags: [Notification]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *         description: The id of the notification
 *    responses:
 *       200:
 *         description: The notification status has been updated
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/get-all-notification:
 *   get:
 *    summary: To get all of the user's notifications
 *    tags: [Notification]
 *    responses:
 *       200:
 *         description: The list of the user's notifications 
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/total-likes:
 *   get:
 *    summary: To get the total number of likes a user has recieved for the day
 *    tags: [Notification]
 *    responses:
 *       200:
 *         description: The total number of likes 
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/total-dislikes:
 *   get:
 *    summary: To get the total number of dislikes a user has recieved for the day
 *    tags: [Notification]
 *    responses:
 *       200:
 *         description: The total number of dislikes 
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 * 
 * /api/v1/notification/total-matches:
 *   get:
 *    summary: To get the total number of matches a user has recieved for the day
 *    tags: [Notification]
 *    responses:
 *       200:
 *         description: The total number of matches 
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */





import { Router } from "express";
import { deleteNotification,filterNotification,changeNotificationStatus,allNotifications,getTotalDislikes,getTotalLikes,getTotalMatches } from "../controllers/notificationController.js";



export const notificationRouter = Router();

notificationRouter.delete('/delete', deleteNotification)

notificationRouter.get('/filter/:date', filterNotification)

notificationRouter.post('/change-notification-status/:id', changeNotificationStatus)

notificationRouter.get('/get-all-notification', allNotifications)

notificationRouter.get('/total-matches', getTotalMatches)

notificationRouter.get('/total-likes', getTotalLikes)

notificationRouter.get('/total-dislikes', getTotalDislikes)