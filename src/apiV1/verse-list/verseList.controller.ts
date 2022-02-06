import { internalServerError, ServerError } from '@/helpers/errorHandler';
import { AddVerseListVersesRequest } from '@/types/requests/verseList/AddVerseListVersesRequest';
import { CreateVerseListRequest } from '@/types/requests/verseList/CreateVerseListRequest';
import { RemoveVerseListVersesRequest } from '@/types/requests/verseList/RemoveVerseListVersesRequest';
import { ISpecifyVerseListParams } from '@/types/requests/verseList/SpecifyVerseListParams';
import { UpdateVerseListRequest } from '@/types/requests/verseList/UpdateVerseListRequest';
import { IReference } from '@/types/utility/reference';
import { parseVerses } from '@/utilities/verseParser';
import { Request, Response } from 'express';
import Verse from '@/apiV1/verse/verse.model';
import { DEFAULT_TRANSLATION } from '@/utilities/constants/bible.constants';
import httpStatus from 'http-status';
import VerseList from './verseList.model';

export class VerseListController {
  // Create a new verse list
  public async createVerseList(req: Request<any, any, CreateVerseListRequest>, res: Response) {
    try {
      const createVerseListRequest = req.body;

      const translation = createVerseListRequest.translation || DEFAULT_TRANSLATION;

      const refs = createVerseListRequest.verses.reduce((arr, v) => {
        const references = parseVerses(v);
        arr.push(...references);
        return arr;
      }, [] as IReference[]);

      const verses = await Verse.find({ $or: refs.map((v) => ({ translation, ...v })) }).exec();
      if (!verses) {
        throw new ServerError({ message: 'verses not found', status: httpStatus.NOT_FOUND });
      }

      const verseList = new VerseList({
        name: createVerseListRequest.name,
        year: createVerseListRequest.year,
        division: createVerseListRequest.division,
        organization: createVerseListRequest.organization,
        translation: createVerseListRequest.translation,
        count: verses.length,
        verses,
      });

      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Update verse list
  public async updateVerseList(req: Request<ISpecifyVerseListParams, any, UpdateVerseListRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOneAndUpdate(
        {
          year: +req.params.year,
          division: req.params.division,
          organization: req.params.organization,
        },
        {
          ...req.body,
        },
      )
        .populate('verses')
        .exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
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
      })
        .populate('verses')
        .exec();

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
      })
        .populate('verses')
        .exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Get all verse lists
  public async getAllVerseLists(req: Request, res: Response) {
    try {
      const verseLists = await VerseList.find().populate('verses').exec();

      if (!verseLists || !verseLists.length) {
        throw new ServerError({ message: 'no verse lists found', status: httpStatus.NOT_FOUND });
      }

      res.status(httpStatus.OK).json(verseLists);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Add verses to a verse list
  public async addVerses(req: Request<ISpecifyVerseListParams, any, AddVerseListVersesRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOne({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      })
        .populate('verses')
        .exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      const translation = verseList.translation || DEFAULT_TRANSLATION;

      const verses = await Verse.find({ $or: req.body.verses.map((v) => ({ translation, ...v })) }).exec();

      if (!verses || !verses.length) {
        throw new ServerError({ message: 'verses not found', status: httpStatus.NOT_FOUND });
      }

      verseList.verses.push(...verses);
      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  // Delete verses from a verse list
  public async removeVerses(req: Request<ISpecifyVerseListParams, any, RemoveVerseListVersesRequest>, res: Response) {
    try {
      const verseList = await VerseList.findOne({
        year: +req.params.year,
        division: req.params.division,
        organization: req.params.organization,
      })
        .populate('verses')
        .exec();

      if (!verseList) {
        throw new ServerError({ message: 'verse list not found', status: httpStatus.NOT_FOUND });
      }

      const translation = verseList.translation || DEFAULT_TRANSLATION;

      const verses = await Verse.find({ $or: req.body.verses.map((v) => ({ translation, ...v })) }).exec();

      if (!verses || !verses.length) {
        throw new ServerError({ message: 'verses not found', status: httpStatus.NOT_FOUND });
      }

      verseList.verses = verseList.verses.filter(
        (v) =>
          !req.body.verses.find((ref) => ref.book === v.book && ref.chapter === v.chapter && ref.verse === v.verse),
      );
      await verseList.save();

      res.status(httpStatus.OK).json(verseList);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

const verseListController = new VerseListController();
export default verseListController;
