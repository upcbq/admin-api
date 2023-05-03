import mongoose from 'mongoose';
import { IReference } from '@shared/types/reference';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     FeatureFlag:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value:
 *           type: boolean
 */

export interface IFeatureFlag {
  name: string;
  value: boolean;
}

export const FeatureFlagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Boolean,
      required: true,
    }
  },
  {
    timestamps: false,
    useNestedStrict: true,
  }
);

FeatureFlagSchema.index(
  { name: 1 },
  { unique: true }
);

FeatureFlagSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  },
});
export default mongoose.model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema);
