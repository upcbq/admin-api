import { Router } from 'express';

export const verseListRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/verseList
 *   post:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateVerseListRequest'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 */
