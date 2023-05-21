import { ServerError, internalServerError } from '@shared/helpers/errorHandler';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import Version from '@/apiV1/version/version.model';

export class VersionController {
  public static async getVersions(req: Request, res: Response) {
    try {
      const versions = await Version.find().exec();
      if (!versions) {
        throw new ServerError({ message: 'versions not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(versions);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}
