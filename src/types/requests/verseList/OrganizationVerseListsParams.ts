import { ParamsDictionary } from 'express-serve-static-core';
import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export interface IOrganizationVerseListsParams extends ParamsDictionary {
  organization: string;
}

export class OrganizationVerseListsParams extends GenericRequest<IOrganizationVerseListsParams> {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public organization: string;
}
