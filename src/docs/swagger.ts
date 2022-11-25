import config from '@/config/config';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: GlAuth
 */

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin API',
      version: '0.1.0',
      description: 'An api for creating and managing verse lists and other admin-level features',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: config.EXTERNAL_URL,
      },
    ],
  },
  apis: ['./src/**/*.ts', '../models/src/**/*.ts'],
};

export const swaggerConfig = swaggerJSDoc(options);
