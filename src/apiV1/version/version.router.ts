import { Router } from 'express';
import { VersionController } from '@/apiV1/version/version.controller';

export const versionRouter: Router = Router();
/**
 * @swagger
 *
 * /v1/versions:
 *   get:
 *     tags:
 *       - Version
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Version'
 */

// Get versions
versionRouter.get(
  '/',
  (req, res, next) => {
    res.set('Cache-control', 'public, max-age=300');
    next();
  },
  VersionController.getVersions,
);
