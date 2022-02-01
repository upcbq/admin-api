import { internalServerError } from '@/helpers/errorHandler';
import { CreateVerseListRequest } from '@/types/requests/verseList/CreateVerseListRequest';
import { Request, Response } from 'express';

export class VerseListController {
  public async createVerseList(req: Request<any, any, CreateVerseListRequest>, res: Response) {
    try {
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}
