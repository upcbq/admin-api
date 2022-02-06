import { GenericRequest } from '@/types/requests/GenericRequest';
import { Reference } from '@/types/utility/reference';
import { IsArray, ValidateNested } from 'class-validator';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     RemoveVerseListVersesRequest:
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

export class RemoveVerseListVersesRequest extends GenericRequest<RemoveVerseListVersesRequest> {
  @IsArray()
  @ValidateNested()
  public verses: Reference[];

  constructor(addVerseListVersesRequest: IRemoveVerseListVersesRequest) {
    super(addVerseListVersesRequest);

    this.verses = addVerseListVersesRequest.verses.map((v) => new Reference(v));
  }
}

interface IRemoveVerseListVersesRequest {
  verses: Reference[];
}
