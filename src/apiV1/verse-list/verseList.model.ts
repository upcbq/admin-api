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
 */
export interface IVerseList extends mongoose.Document {
  name: string;
  year: number;
  verse: string[];
  division: IDivision;
  organization: IOrganization;
}

export interface IVerseListJson {
  name: string;
  year: number;
  verse: string[];
  division: IDivisionJson;
  organization: IOrganizationJson;
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
    verses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Verse' }],
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

VerseListSchema.index({ name: 1 }, { unique: true });

VerseListSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  },
});

export default mongoose.model<IVerseList>('VerseList', VerseListSchema);
