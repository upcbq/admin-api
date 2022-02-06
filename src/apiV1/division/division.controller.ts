import { internalServerError } from '@/helpers/errorHandler';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import VerseList from '@/apiV1/verse-list/verseList.model';

export class DivisionController {
  /**
   * Get all divisions
   */
  public async getAllDivisions(req: Request, res: Response) {
    try {
      const divisions = await VerseList.distinct('division').exec();

      res.status(httpStatus.OK).json(divisions);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const divisionController = new DivisionController();
export default divisionController;
