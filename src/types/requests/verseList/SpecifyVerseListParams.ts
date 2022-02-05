import { ParamsDictionary } from 'express-serve-static-core';
import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export interface ISpecifyVerseListParams extends ParamsDictionary {
  organization: string;
  year: string;
  division: string;
}

export class SpecifyVerseListParams extends GenericRequest<SpecifyVerseListParams> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public name: string;

  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  public year: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public division: string;
}
