import mongoose from 'mongoose';
import { IVerse, IVerseJson } from '@/apiV1/verse/verse.model';

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
 *             $ref: '#/components/schemas/Verse'
 */
export interface IVerseList extends mongoose.Document {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: string;
  organization: string;
  verses: IVerse[];
}

export interface IVerseListJson {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: string;
  organization: string;
  verses: IVerseJson[];
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
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    verses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Verse' }],
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

VerseListSchema.index({ name: 1, division: 1, organization: 1 }, { unique: true });
VerseListSchema.index({ year: 1, division: 1, organization: 1 }, { unique: true });

VerseListSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  },
});

export default mongoose.model<IVerseList>('VerseList', VerseListSchema);
