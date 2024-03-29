import { internalServerError, ServerError } from '@shared/helpers/errorHandler';
import { IAddVerseListVersesRequest } from '@/types/requests/verseList/AddVerseListVersesRequest';
import { ICreateVerseListRequest } from '@/types/requests/verseList/CreateVerseListRequest';
import { IGetVerseListByIdParams } from '@/types/requests/verseList/GetVerseListByIdParams';
import { IOrganizationVerseListsParams } from '@/types/requests/verseList/OrganizationVerseListsParams';
import { IRemoveVerseListVersesRequest } from '@/types/requests/verseList/RemoveVerseListVersesRequest';
import { ISpecifyVerseListParams } from '@/types/requests/verseList/SpecifyVerseListParams';
import { IUpdateVerseListRequest } from '@/types/requests/verseList/UpdateVerseListRequest';
import { IReference } from '@shared/types/reference';
import { parseVerses } from '@shared/utilities/verseParser';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import VerseList, { IVerseListVerse, IVerseListVerseJson } from '@/apiV1/verse-list/verseList.model';

export class VerseListController {
  // Create a new verse list
  public async createVerseList(req: Request<any, any, ICreateVerseListRequest>, res: Response) {
    try {
      const createVerseListRequest = req.body;

      const refs = createVerseListRequest.verses.reduce((arr, v) => {
        const references = parseVerses(v);
        arr.push(...references.map((r, i) => ({ ...r, sortOrder: arr.length + i })));
        return arr;
      }, [] as IReference[]);

      const verseList = new VerseList({
        name: createVerseListRequest.name,
        year: createVerseListRequest.year,
        division: createVerseListRequest.division,
        organization: createVerseListRequest.organization,
        translation: createVerseListRequest.translation,
        count: refs.length,
        verses: refs,
      });

      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Update verse list
  public async updateVerseList(req: Request<ISpecifyVerseListParams, any, IUpdateVerseListRequest>, res: Response) {
    try {
      console.log('body', req.body);
      const verseList = await VerseList.findOneAndUpdate(
        {
          year: +req.params.year,
          division: req.params.division,
          organization: req.params.organization,
        },
        {
          ...req.body,
        },
      ).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      console.log('err', err);
      internalServerError(err, req, res);
    }
  }

  // Delete verse list
  public async deleteVerseList(req: Request<ISpecifyVerseListParams>, res: Response) {
    try {
      const verseList = await VerseList.findOneAndDelete({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      }).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.sendStatus(httpStatus.NO_CONTENT);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Get verse list
  public async getVerseList(req: Request<ISpecifyVerseListParams>, res: Response) {
    try {
      const verseList = await VerseList.findOne({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      }).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Get verse list by id
  public async getVerseListById(req: Request<IGetVerseListByIdParams>, res: Response) {
    try {
      const verseList = await VerseList.findById(req.params.verseListId).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Get all verse lists
  public async getAllVerseLists(req: Request<Partial<IOrganizationVerseListsParams>>, res: Response) {
    try {
      const queryObj = {} as Record<string, string>;
      if (req.params.organization) {
        queryObj.organization = req.params.organization;
      }
      const verseLists = await VerseList.find(queryObj, { verses: 0 }).exec();

      if (!verseLists || !verseLists.length) {
        throw new ServerError({ message: 'no verse lists found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseLists);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Add verses to a verse list
  public async addVerses(req: Request<ISpecifyVerseListParams, any, IAddVerseListVersesRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOne({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      }).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      (verseList.verses as IVerseListVerseJson[]).push(
        ...req.body.verses.map((v, i) => ({ ...v, sortOrder: verseList.verses.length + i })),
      );

      verseList.count = verseList.verses.length;

      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Delete verses from a verse list
  public async removeVerses(req: Request<ISpecifyVerseListParams, any, IRemoveVerseListVersesRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOne({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      }).exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      let removedCount = 0;
      const arr: IVerseListVerse[] = [];
      for (const v of verseList.verses.sort((a, b) => a.sortOrder - b.sortOrder)) {
        const ref = req.body.verses.find((r) => r.book === v.book && r.chapter === v.chapter && r.verse === v.verse);

        if (ref) {
          removedCount++;
        } else {
          v.sortOrder -= removedCount;
          arr.push(v);
        }
      }

      verseList.verses = arr;
      verseList.count = verseList.verses.length;

      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const verseListController = new VerseListController();
export default verseListController;
