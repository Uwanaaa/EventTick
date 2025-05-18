/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - room
 *         - sender_id
 *         - reciever_id
 *         - message
 *         - sent_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message entry in the table
 *         room:
 *           type: string
 *           description: The room name of a particular user's conversation which the message is linked to
 *         sender_id:
 *           type: integer
 *           description: The id of the user that sends the message
 *         reciever_id:
 *           type: integer
 *           description: The id of the user that recieves the message
 *         message:
 *           type: string
 *           description: The message
 *         sent_at:
 *           type: string
 *           format: date
 *           description: The date and the time the message was sent
 *       example:
 *         id: d5fE_asz
 *         room: user1_user2_chat
 *         sender_id: 3
 *         reciever_id: 1
 *         message: Hi
 *         sent_at: 2025-03-31 09:31:00 
 *         
 *     ActionUnblock:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the blocked user. It can be either Blocked or Unblocked
 *       example:
 *         status: Unblocked
 * 
 *     LikesandDislikes:
 *       type: object
 *       required:
 *         - user1_id
 *         - user2_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the object on the likes and dislikes table
 *         user1_id:
 *           type: integer
 *           description: The id of of the current user 
 *         user2_id: 
 *           type: integer
 *           description: The id of the other user that is either liked or disliked
 *         status:
 *           type: string
 *           description: The status of the user which can either be like or dislike
 *       example:
 *         id: d5fE_asz
 *         user1_id: 3
 *         user2_id: 1
 *         status: "like"
 */




/**
 * @swagger
 * tags:
 *   name: Message
 *   description: The Message managment API
 * /api/v1/messages/filter:
 *   get:
 *    summary: To filter message according to a specific date
 *    tags: [Message]
 *    parameters:
 *       - in: query
 *         name: user_2_id
 *         schema:
 *          type: integer
 *          required: true
 *         description: The user id of the user in the conversation
 *       - in: query
 *         name: date
 *         schema:
 *          type: string
 *          required: true
 *         description: The date of the conversation to be filtered out
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Message'
 *    responses:
 *       200:
 *         description: The list of nessages fitting the specified date
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 * 
 * /api/v1/messages/delete-chat:
 *   delete:
 *    summary: To delete a specified chat 
 *    tags: [Message]
 *    parameters:
 *     - in: query
 *       name: message_id
 *       schema:
 *         type: integer
 *         required: true
 *         description: The id of the message to be deleted
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Message'
 *    responses:
 *       200:
 *         description: The message has been deleted
 *       500:
 *         description: Server error
 * 
 * /api/v1/messages/delete-conversation:
 *   delete:
 *    summary: To delete the whole chat
 *    tags: [Message]
 *    parameters:
 *     - in: query
 *       name: user_2_id
 *       schema:
 *         type: integer
 *         required: true
 *       description: The id of the other user in the conversation
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Message'
 *    responses:
 *       200:
 *         description: The conversation has been deleted
 *       500:
 *         description: Server error
 * 
 * /api/v1/messages/delete-match:
 *   delete:
 *    summary: To delete a match and the conversation
 *    tags: [Message]
 *    parameters:
 *     - in: query
 *       name: user_id
 *       schema:
 *         type: integer
 *         required: true
 *       description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Message'
 *    responses:
 *       200:
 *         description: The match and messages have been deleted successfully
 *       500:
 *         description: Server error
 */


import { Router } from "express";
import { filterMessage, deleteChat, deleteConversation, deleteMatch } from "../controllers/messageController.js";


export const messagingRouter = Router();

messagingRouter.get('/filter', filterMessage)

// messagingRouter.get()

messagingRouter.delete('/delete-chat', deleteChat)

messagingRouter.delete('/delete-conversation', deleteConversation)

messagingRouter.delete('/delete-match', deleteMatch)