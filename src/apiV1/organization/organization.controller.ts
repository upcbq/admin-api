import { internalServerError } from '@shared/helpers/errorHandler';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import VerseList from '@/apiV1/verse-list/verseList.model';

export class OrganizationController {
  /**
   * Get all organizations
   */
  public async getAllOrganizations(req: Request, res: Response) {
    try {
      const organizations = await VerseList.distinct('organization').exec();

      res.status(httpStatus.OK).json(organizations);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const organizationController = new OrganizationController();
export default organizationController;
