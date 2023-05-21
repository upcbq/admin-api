import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Version:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value:
 *           type: string
 */

export interface IVersion {
  name: string;
  value: string;
}

export const VersionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

VersionSchema.index({ name: 1 }, { unique: true });

VersionSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
  },
});
export default mongoose.model<IVersion>('Version', VersionSchema);
