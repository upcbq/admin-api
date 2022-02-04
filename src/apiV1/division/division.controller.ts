import { internalServerError, ServerError } from '@/helpers/errorHandler';
import { CreateDivisionBody } from '@/types/requests/division/CreateDivisionBody';
import { DeleteDivisionRequest } from '@/types/requests/division/DeleteDivisionRequest';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Division from './division.model';

export class DivisionController {
  /**
   * Create a division
   */
  public async createDivision(req: Request<any, any, CreateDivisionBody>, res: Response) {
    try {
      const division = new Division(req.body);

      await division.save();

      res.status(httpStatus.OK).json(division);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Get all divisions
   */
  public async getAllDivisions(req: Request<any, any, CreateDivisionBody>, res: Response) {
    try {
      const divisions = await Division.find({}, null, { limit: 100 }).exec();

      res.status(httpStatus.OK).json(divisions.map((d) => d.name));
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Get all divisions
   */
  public async deleteDivision(req: Request<DeleteDivisionRequest>, res: Response) {
    try {
      const division = await Division.findOneAndDelete({ name: req.params.divisionName }).exec();

      if (!division) {
        throw new ServerError({ message: 'division not found', status: httpStatus.NOT_FOUND });
      }

      res.sendStatus(httpStatus.NO_CONTENT);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const divisionController = new DivisionController();
export default divisionController;
