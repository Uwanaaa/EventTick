/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - reported_by
 *         - reported_user
 *         - reason
 *         - status 
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the report
 *         reported_by:
 *           type: integer
 *           description: The id of user that reported
 *         reported_user:
 *           type: integer
 *           description: The id of the reported user
 *         reason:
 *           type: string
 *           description: The reason why the user was reported
 *         status:
 *           type: string
 *           description: The status of the report
 *         created_at:
 *           type: string
 *           format: date
 *           description: The date the report was created
 *         updated_at:
 *           type: string
 *           format: date
 *           description: The date the report was updated
 *       example:
 *         id: d5fE_asz
 *         reported_by: 3
 *         reported_user: 1
 *         reason: catfishing
 *         status: Resolved
 * 
 *     UpdateReports:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The status of the report
 *       example:
 *         status: Pending
 *         
 */




/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: The Reports managing API
 * api/v1/report/reports:
 *   get:
 *    summary: Lists all the reports
 *    tags: [Reports]
 *    responses:
 *       200:
 *         description: The list of the reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       500:
 *         description: Server error
 * api/v1/report/report/{reportId}:
 *   get:
 *    summary: Get a report with its id 
 *    tags: [Reports]
 *    parameters:
 *       - in: path
 *         name: reportId
 *         schema:
 *           type: string
 *         required: true
 *         description: The report id
 *    responses:
 *       200:
 *         description: The report
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Report'
 *       500:
 *         description: Server error
 *   put:
 *    summary: Update the report status by the id
 *    tags: [Reports]
 *    parameters:
 *      - in: path
 *        name: reportId
 *        schema:
 *          type: string
 *        required: true
 *        description: The report id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateReports'
 *    responses:
 *      200:
 *        description: The report's status was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Report'
 *      404:
 *        description: The report was not found
 *      500:
 *        description: Server error
 * 
 * api/v1/report/report:
 *   delete:
 *     summary: Remove the Report by id
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: reportId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Report id
 *
 *     responses:
 *       200:
 *         description: The Report was deleted
 *       404:
 *         description: The Report was not found
 */


import express from 'express';
// import { getAllReports, getReport, updateReport, deleteReport } from '../controllers/reportController.js';



export const reportRouter = express.Router();

// reportRouter.get('/reports', getAllReports);

// reportRouter.get('/report/:reportId', getReport);

// reportRouter.put('/report/:reportId', updateReport);

// reportRouter.delete('/report', deleteReport);