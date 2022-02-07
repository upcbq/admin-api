import { ParamsDictionary } from 'express-serve-static-core';
import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export interface IGetVerseListByIdParams extends ParamsDictionary {
  verseListId: string;
}

export class GetVerseListByIdParams extends GenericRequest<GetVerseListByIdParams> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public verseListId: string;
}
