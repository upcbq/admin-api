import { validateRequestBody } from '@/middleware/validator';
import { CreateDivisionBody } from '@/types/requests/division/CreateDivisionBody';
import { Router } from 'express';
import divisionController from './division.controller';

export const divisionRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/division:
 *   post:
 *     tags:
 *       - Division
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateDivisionBody'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Division'
 *
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
 *
 * /v1/division/{divisionName}:
 *   delete:
 *     tags:
 *       - Division
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: divisionName
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '204':
 *         description: The division was deleted successfully.
 */

// Create a division
divisionRouter.post('/', validateRequestBody(CreateDivisionBody), divisionController.createDivision);

// Get all divisions
divisionRouter.get('/', divisionController.getAllDivisions);

// Delete a division
divisionRouter.delete('/:divisionName', divisionController.deleteDivision);
