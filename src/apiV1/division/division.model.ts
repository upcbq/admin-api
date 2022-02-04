import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Division:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */
export interface IDivision extends mongoose.Document {
  name: string;
}

export interface IDivisionJson {
  name: string;
}

export const DivisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

DivisionSchema.index({ name: 1 }, { unique: true });

DivisionSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
  },
});

export default mongoose.model<IDivision>('Division', DivisionSchema);
