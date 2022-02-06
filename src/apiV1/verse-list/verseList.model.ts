import mongoose from 'mongoose';
import { IReference } from '@/types/utility/reference';

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
export interface IVerseListVerseJson extends IReference {
  sortOrder: number;
}

export interface IVerseListVerse extends mongoose.Document, IReference {
  sortOrder: number;
}

export interface IVerseList extends mongoose.Document {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: string;
  organization: string;
  verses: IVerseListVerse[];
}

export interface IVerseListJson {
  name: string;
  year: number;
  count: number;
  translation: string;
  division: string;
  organization: string;
  verses: IVerseListVerseJson[];
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
    verses: [
      {
        _id: false,
        book: {
          type: String,
          required: true,
          trim: true,
        },
        chapter: {
          type: Number,
          required: true,
        },
        verse: {
          type: Number,
          required: true,
        },
        sortOrder: {
          type: Number,
          required: true,
        },
      },
    ],
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
