import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'site_cms',
    },
    home: {
      type: Object,
      default: {},
    },
    about: {
      type: Object,
      default: {},
    },
    contact: {
      type: Object,
      default: {},
    },
    petsPage: {
      type: Object,
      default: {},
    },
    accessoriesPage: {
      type: Object,
      default: {},
    },
    global: {
      type: Object,
      default: {},
    },
  },
  { strict: false, timestamps: true }
);

export const Cms = mongoose.model('Cms', cmsSchema);

