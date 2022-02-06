import { Router } from 'express';
import organizationController from './organization.controller';

export const organizationRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/organization:
 *   get:
 *     tags:
 *       - Organization
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

// Get all organizations
organizationRouter.get('/', organizationController.getAllOrganizations);
