import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */
export interface IOrganization extends mongoose.Document {
  name: string;
}

export interface IOrganizationJson {
  name: string;
}

export const OrganizationSchema = new mongoose.Schema(
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

OrganizationSchema.index({ name: 1 }, { unique: true });

OrganizationSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
  },
});

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
