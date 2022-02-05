import { validateRequestBody, validateRequestParams } from '@/middleware/validator';
import { CreateOrganizationBody } from '@/types/requests/organization/CreateOrganizationBody';
import { DeleteOrganizationRequest } from '@/types/requests/organization/DeleteOrganizationRequest';
import { Router } from 'express';
import organizationController from './organization.controller';

export const organizationRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/organization:
 *   post:
 *     tags:
 *       - Organization
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateOrganizationBody'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *
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
 *
 * /v1/organization/{organizationName}:
 *   delete:
 *     tags:
 *       - Organization
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organizationName
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '204':
 *         description: The organization was deleted successfully.
 */

// Create an organization
organizationRouter.post('/', validateRequestBody(CreateOrganizationBody), organizationController.createOrganization);

// Get all organizations
organizationRouter.get('/', organizationController.getAllOrganizations);

// Delete an organization
organizationRouter.delete(
  '/:organizationName',
  validateRequestParams(DeleteOrganizationRequest),
  organizationController.deleteOrganization,
);
