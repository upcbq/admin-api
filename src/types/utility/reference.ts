import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Reference:
 *       type: object
 *       properties:
 *         book:
 *           type: string
 *         chapter:
 *           type: number
 *         verse:
 *           type: number
 */

export interface IReference {
  book: string;
  chapter: number;
  verse: number;
}

export class Reference extends GenericRequest<Reference> implements IReference {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  public book: string;

  @IsInt()
  @IsDefined()
  public chapter: number;

  @IsInt()
  @IsDefined()
  public verse: number;
}
