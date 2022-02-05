import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     CreateOrganizationBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 */

export class CreateOrganizationBody extends GenericRequest<CreateOrganizationBody> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}
