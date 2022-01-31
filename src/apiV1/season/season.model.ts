import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Season:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         year:
 *           type: number
 */
export interface ISeason extends mongoose.Document {
  name: string;
  year: number;
}

export interface ISeasonJson {
  name: string;
  year: number;
}

export const SeasonSchema = new mongoose.Schema(
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
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

SeasonSchema.index({ name: 1 }, { unique: true });

SeasonSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  },
});

export default mongoose.model<ISeason>('Season', SeasonSchema);
