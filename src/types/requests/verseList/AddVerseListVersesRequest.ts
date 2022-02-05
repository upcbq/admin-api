import { GenericRequest } from '@/types/requests/GenericRequest';
import { Reference } from '@/types/utility/reference';
import { IsArray, ValidateNested } from 'class-validator';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     AddVerseListVersesRequest:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verses:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reference'
 */

export class AddVerseListVersesRequest extends GenericRequest<AddVerseListVersesRequest> {
  @IsArray()
  @ValidateNested()
  public verses: Reference;
}
