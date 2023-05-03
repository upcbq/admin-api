import { Router } from 'express';
import { FeatureFlagController } from '@/apiV1/featureFlags/featureFlag.controller';

export const featureFlagRouter: Router = Router();
/**
 * @swagger
 *
 * /v1/featureFlag:
 *   get:
 *     tags:
 *       - FeatureFlag
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FeatureFlag'
 */


// Get all feature flags
featureFlagRouter.get('/', (req, res, next) => { res.set('Cache-control', 'public, max-age=300'); next(); }, FeatureFlagController.getFeatureFlags);