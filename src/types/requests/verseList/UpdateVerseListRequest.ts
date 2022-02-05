import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsInt, IsString, Max, Min } from 'class-validator';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     UpdateVerseListRequest:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *               translation:
 *                 type: string
 *               division:
 *                 type: string
 *               organization:
 *                 type: string
 */

export class UpdateVerseListRequest extends GenericRequest<UpdateVerseListRequest> {
  @IsString()
  name: string;

  @IsInt()
  @Min(1900)
  @Max(3000)
  year: number;

  @IsString()
  public division: string;

  @IsString()
  public organization: string;

  @IsString()
  public translation: string;
}
