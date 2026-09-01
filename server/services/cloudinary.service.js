import cloudinary from '../config/cloudinary.js';

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      // In dev mode when Cloudinary keys are not provided, generate a high-res mock image URL
      const isVideo = options.resource_type === 'video';
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mockUrl = isVideo
        ? 'https://assets.mixkit.co/videos/preview/mixkit-dog-catching-a-ball-in-a-park-1481-large.mp4'
        : `https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80`;
      return resolve({
        secure_url: mockUrl,
        public_id: mockId,
        resource_type: isVideo ? 'video' : 'image',
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'the-dogs-garage',
        resource_type: options.resource_type || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId || publicId.startsWith('mock_')) return true;
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) return true;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === 'ok';
  } catch (error) {
    console.error('[Cloudinary Media Error] Failed to delete asset:', error.message);
    return false;
  }
};

export const enforceMediaLimitAndEvict = async (imagesArray = [], maxAllowed = 4) => {
  if (!imagesArray || imagesArray.length <= maxAllowed) {
    return imagesArray;
  }

  const toKeep = imagesArray.slice(0, maxAllowed);
  const toDelete = imagesArray.slice(maxAllowed);

  for (const img of toDelete) {
    if (img.public_id) {
      await deleteFromCloudinary(img.public_id, 'image');
    }
  }

  return toKeep;
};
