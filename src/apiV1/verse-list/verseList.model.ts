import mongoose from 'mongoose';
import { IDivision, IDivisionJson } from '@/apiV1/division/division.model';
import { IOrganization, IOrganizationJson } from '@/apiV1/organization/organization.model';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     VerseList:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         year:
 *           type: number
 *         division:
 *           type: string
 *         organization:
 *           type: string
 *         translation:
 *           type: string
 *         count:
 *           type: number
 *         verses:
 *           type: array
 *           items:
 *             type: string
 */
export interface IVerseList extends mongoose.Document {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: IDivision;
  organization: IOrganization;
  verses: string[];
}

export interface IVerseListJson {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: IDivisionJson;
  organization: IOrganizationJson;
  verses: string[];
}

export const VerseListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    translation: {
      type: String,
      required: false,
      trim: true,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    verses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Verse' }],
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

VerseListSchema.index({ name: 1, division: 1, organization: 1 }, { unique: true });

VerseListSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  },
});

export default mongoose.model<IVerseList>('VerseList', VerseListSchema);
