import { uploadBufferToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

export const uploadImage = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No image files provided for upload.' });
    }

    const folder = req.body.folder || 'the-dogs-garage/uploads';
    const uploadedResults = [];

    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'image',
        folder,
      });
      uploadedResults.push({
        url: result.secure_url,
        secure_url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Uploaded ${uploadedResults.length} image(s) successfully.`,
      url: uploadedResults[0]?.secure_url,
      publicId: uploadedResults[0]?.publicId,
      files: uploadedResults,
      urls: uploadedResults.map((r) => r.secure_url),
    });
  } catch (error) {
    next(error);
  }
};

export const uploadVideo = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No video files provided for upload.' });
    }

    const folder = req.body.folder || 'the-dogs-garage/videos';
    const uploadedResults = [];

    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'video',
        folder,
      });
      uploadedResults.push({
        url: result.secure_url,
        secure_url: result.secure_url,
        publicId: result.public_id,
        thumbnail: result.secure_url.replace(/\.[^/.]+$/, '.jpg'),
      });
    }

    return res.status(200).json({
      success: true,
      message: `Uploaded ${uploadedResults.length} video(s) successfully.`,
      url: uploadedResults[0]?.secure_url,
      thumbnail: uploadedResults[0]?.thumbnail,
      publicId: uploadedResults[0]?.publicId,
      files: uploadedResults,
      urls: uploadedResults.map((r) => r.secure_url),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required.' });
    }
    await deleteFromCloudinary(publicId, resourceType);
    return res.status(200).json({ success: true, message: 'Media deleted from Cloudinary.' });
  } catch (error) {
    next(error);
  }
};
