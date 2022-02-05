import { internalServerError, ServerError } from '@/helpers/errorHandler';
import { CreateOrganizationBody } from '@/types/requests/organization/CreateOrganizationBody';
import { IDeleteOrganizationRequest } from '@/types/requests/organization/DeleteOrganizationRequest';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import VerseList from '@/apiV1/verse-list/verseList.model';
import Organization from './organization.model';

export class OrganizationController {
  /**
   * Create an organization
   */
  public async createOrganization(req: Request<any, any, CreateOrganizationBody>, res: Response) {
    try {
      const organization = new Organization(req.body);

      await organization.save();

      res.status(httpStatus.OK).json(organization);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Get all organizations
   */
  public async getAllOrganizations(req: Request, res: Response) {
    try {
      const organizations = await Organization.find({}, null, { limit: 100 }).exec();

      res.status(httpStatus.OK).json(organizations.map((d) => d.name));
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Delete an organization
   */
  public async deleteOrganization(req: Request<IDeleteOrganizationRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOne({ organization: req.params.organizationName }).exec();

      if (verseList) {
        throw new ServerError({ message: 'verselist with organization exists', status: httpStatus.FORBIDDEN });
      }

      const organization = await Organization.findOneAndDelete({ name: req.params.organizationName }).exec();

      if (!organization) {
        throw new ServerError({ message: 'organization not found', status: httpStatus.NOT_FOUND });
      }

      res.sendStatus(httpStatus.NO_CONTENT);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const organizationController = new OrganizationController();
export default organizationController;
