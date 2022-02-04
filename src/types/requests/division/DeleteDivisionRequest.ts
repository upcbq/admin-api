import { ParamsDictionary } from 'express-serve-static-core';

export interface DeleteDivisionRequest extends ParamsDictionary {
  divisionName: string;
}
