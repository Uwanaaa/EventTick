/**
 * @swagger
 * components:
 *   schemas:
 *     Matches:
 *       type: object
 *       required:
 *         - user1_id
 *         - user2_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the match
 *         user1_id:
 *           type: integer
 *           description: The id of one of the matched user 
 *         user2_id:
 *           type: integer
 *           description: The id of the other matched user
 *         matched_at:
 *           type: string
 *           format: date
 *           description: The date the matching
 *       example:
 *         id: d5fE_asz
 *         user1_id: 3
 *         user2_id: 1
 *         
 *     ActionMatch:
 *       type: object
 *       required:
 *         - userId
 *         - action
 *       properties:
 *         userId:
 *           type: integer
 *           description: The id of the user suggested as a match
 *         action:
 *           type: string
 *           description: The action of the swipe. It is either like or dislike
 *       example:
 *         userId: 3
 *         action: like
 */




/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: The Matches managing API
 * /api/v1/match/suggestions:
 *   get:
 *    summary: List of match suggestions
 *    tags: [Matches]
 *    responses:
 *       200:
 *         description: The list of the match suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Matches'
 *       500:
 *         description: Server error
 * /api/v1/match/like-or-dislike:
 *   post:
 *     summary: Handling matching of user when swiped on
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionMatch'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionMatch'
 *       500:
 *         description: Some server error
 */



import { Router } from 'express';
import { likeOrDislike, getSuggestions } from '../controllers/matchingController.js';


export const matchesRouter = Router();

matchesRouter.post('/like-or-dislike', likeOrDislike);

matchesRouter.get('/suggestions', getSuggestions);

