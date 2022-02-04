import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     CreateDivisionBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 */

export class CreateDivisionBody extends GenericRequest<CreateDivisionBody> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}
