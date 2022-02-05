import { ParamsDictionary } from 'express-serve-static-core';
import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export interface IDeleteOrganizationRequest extends ParamsDictionary {
  organizationName: string;
}

export class DeleteOrganizationRequest extends GenericRequest<DeleteOrganizationRequest> {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  organizationName: string;
}
