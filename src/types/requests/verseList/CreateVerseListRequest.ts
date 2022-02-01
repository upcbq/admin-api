import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export interface ICreateVerseListRequest {
  name: string;
  year: number;
  verses: string[];
  division: string;
  organization: string;
}

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     CreateVerseListRequest:
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
 *               verses:
 *                 type: array
 *                 items:
 *                   type: string
 */

export class CreateVerseListRequest extends GenericRequest<ICreateVerseListRequest> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public name: string;

  @IsInt()
  @IsDefined()
  @Min(1900)
  @Max(3000)
  public year: number;

  @IsArray()
  @IsString({ each: true })
  public verses: string[];

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public division: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public organization: string;

  constructor(req: ICreateVerseListRequest) {
    super(req);

    this.verses = req.verses;
  }
}
