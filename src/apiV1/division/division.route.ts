import { Router } from 'express';
import divisionController from './division.controller';

export const divisionRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/division:
 *   get:
 *     tags:
 *       - Division
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

// Get all divisions
divisionRouter.get('/', divisionController.getAllDivisions);
