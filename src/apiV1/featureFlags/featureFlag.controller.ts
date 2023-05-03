import FeatureFlag from "@/apiV1/featureFlags/featureFlag.model";
import { ServerError, internalServerError } from "@shared/helpers/errorHandler";
import httpStatus from 'http-status';
import { Request, Response } from 'express';

export class FeatureFlagController {
  public static async getFeatureFlags(req: Request, res: Response) {
    try {
      const featureFlags = await FeatureFlag.find().exec();
      if (!featureFlags) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(featureFlags);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}
