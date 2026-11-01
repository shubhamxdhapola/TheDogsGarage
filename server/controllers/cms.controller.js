import { Cms } from '../models/Cms.js';
import { defaultCmsData } from '../utils/defaultCmsData.js';

// Deep merge helper to guarantee defaults for any missing nested keys
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        if (target[key] === undefined || target[key] === null) {
          Object.assign(output, { [key]: source[key] });
        }
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * GET /api/cms - Public endpoint to retrieve all live CMS content
 */
export const getCmsContent = async (req, res, next) => {
  try {
    let cms = await Cms.findOne({ key: 'site_cms' }).lean();

    if (!cms) {
      const created = await Cms.create(defaultCmsData);
      cms = created.toObject();
    }

    // Merge with defaultCmsData to ensure any new keys exist
    const merged = deepMerge(cms, defaultCmsData);

    return res.status(200).json({
      success: true,
      cms: merged,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cms - Admin endpoint to update CMS content (section or entire document)
 */
export const updateCmsContent = async (req, res, next) => {
  try {
    const updateData = req.body;

    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid CMS update payload',
      });
    }

    // Never overwrite key
    delete updateData.key;
    delete updateData._id;

    // Use findOneAndUpdate with upsert
    let existing = await Cms.findOne({ key: 'site_cms' });
    if (!existing) {
      existing = new Cms({ ...defaultCmsData, ...updateData });
      await existing.save();
    } else {
      // If updating a specific top-level section (e.g. { section: 'home.hero', data: { ... } })
      if (updateData.section && updateData.data) {
        existing.set(updateData.section, updateData.data);
      } else {
        // Deep assign top-level keys
        Object.keys(updateData).forEach((k) => {
          if (typeof updateData[k] === 'object' && !Array.isArray(updateData[k]) && existing[k]) {
            existing[k] = { ...existing[k], ...updateData[k] };
            existing.markModified(k);
          } else {
            existing[k] = updateData[k];
            existing.markModified(k);
          }
        });
      }
      await existing.save();
    }

    const merged = deepMerge(existing.toObject(), defaultCmsData);

    return res.status(200).json({
      success: true,
      message: 'CMS content updated successfully!',
      cms: merged,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cms/reset - Admin endpoint to reset a section or the entire CMS
 */
export const resetCmsContent = async (req, res, next) => {
  try {
    const { section } = req.body || {};

    let cms = await Cms.findOne({ key: 'site_cms' });

    if (!section || section === 'all') {
      if (cms) {
        await Cms.deleteOne({ key: 'site_cms' });
      }
      cms = await Cms.create(defaultCmsData);
    } else {
      // Reset specific top-level section
      if (defaultCmsData[section] && cms) {
        cms[section] = defaultCmsData[section];
        cms.markModified(section);
        await cms.save();
      }
    }

    const merged = deepMerge(cms.toObject(), defaultCmsData);

    return res.status(200).json({
      success: true,
      message: section && section !== 'all' ? `Reset section '${section}' to defaults!` : 'Reset all CMS content to defaults!',
      cms: merged,
    });
  } catch (error) {
    next(error);
  }
};

