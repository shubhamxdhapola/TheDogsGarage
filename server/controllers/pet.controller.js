import { Pet } from '../models/Pet.js';
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  enforceMediaLimitAndEvict,
} from '../services/cloudinary.service.js';
import { createPetSchema } from '../validators/pet.validator.js';

const generatePetSlug = (name, breed) => {
  const base = `${breed}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base}-${Date.now().toString().slice(-4)}`;
};

const buildWhatsAppUrl = (pet) => {
  const businessPhone = process.env.BUSINESS_WHATSAPP || process.env.BUSINESS_PHONE || '+916264369991';
  const phone = businessPhone.replace(/\D/g, '');
  const message = `Hi, I'm interested in ${pet.name}, the ${pet.breed} (ID: ${pet._id}) listed on The Dogs Garage for ₹${pet.price.toLocaleString('en-IN')}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const getAllPets = async (req, res, next) => {
  try {
    const {
      breed,
      gender,
      age,
      size,
      minPrice,
      maxPrice,
      isAvailable,
      isFeatured,
      search,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (breed && breed !== 'All') {
      query.breed = { $regex: new RegExp(breed, 'i') };
    }
    if (gender && gender !== 'All') {
      query.gender = gender;
    }
    if (size && size !== 'All') {
      query.size = size;
    }
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }
    if (isFeatured !== undefined && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [pets, total] = await Promise.all([
      Pet.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      Pet.countDocuments(query),
    ]);

    const formattedPets = pets.map((pet) => ({
      ...pet.toObject(),
      whatsAppUrl: buildWhatsAppUrl(pet),
      callNumber: process.env.BUSINESS_PHONE || '+916264369991',
    }));

    return res.status(200).json({
      pets: formattedPets,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let pet = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      pet = await Pet.findById(id);
    } else {
      pet = await Pet.findOne({ slug: id });
    }

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const petObj = pet.toObject();
    petObj.whatsAppUrl = buildWhatsAppUrl(pet);
    petObj.callNumber = process.env.BUSINESS_PHONE || '+916264369991';

    return res.status(200).json({ pet: petObj });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const validatedData = createPetSchema.parse(req.body);
    const slug = generatePetSlug(validatedData.name, validatedData.breed);

    const pet = await Pet.create({
      ...validatedData,
      slug,
      images: req.body.images || [],
      videos: req.body.videos || [],
    });

    return res.status(201).json({
      message: 'Pet listed successfully.',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    return res.status(200).json({
      message: 'Pet updated successfully.',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Delete associated media from Cloudinary
    for (const img of pet.images) {
      if (img.publicId) deleteFromCloudinary(img.publicId, 'image').catch(() => {});
    }
    for (const vid of pet.videos) {
      if (vid.publicId) deleteFromCloudinary(vid.publicId, 'video').catch(() => {});
    }

    await Pet.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Pet and associated media deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload photos with strict 30 photo limit FIFO eviction
 */
export const uploadPetImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ message: 'No image files provided for upload.' });
    }

    const uploadedItems = [];
    for (const file of files) {
      const uploadResult = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'image',
        folder: `the-dogs-garage/pets/${pet._id}/photos`,
      });

      uploadedItems.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        order: pet.images.length + uploadedItems.length,
        createdAt: new Date(),
      });
    }

    // Enforce 30 photo limit and evict oldest if necessary
    const updatedImages = await enforceMediaLimitAndEvict(pet.images, uploadedItems, 30, 'image');

    pet.images = updatedImages;
    await pet.save();

    return res.status(200).json({
      message: `Uploaded ${uploadedItems.length} photo(s). Total photos: ${updatedImages.length}/30.`,
      images: pet.images,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePetImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const imageItem = pet.images.id(imageId);
    if (!imageItem) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (imageItem.publicId) {
      deleteFromCloudinary(imageItem.publicId, 'image').catch(() => {});
    }

    pet.images.pull({ _id: imageId });
    await pet.save();

    return res.status(200).json({
      message: 'Photo deleted successfully.',
      images: pet.images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload videos with strict 30 video limit FIFO eviction
 */
export const uploadPetVideos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ message: 'No video files provided for upload.' });
    }

    const uploadedVideos = [];
    for (const file of files) {
      const uploadResult = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'video',
        folder: `the-dogs-garage/pets/${pet._id}/videos`,
      });

      uploadedVideos.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        thumbnail: uploadResult.secure_url.replace(/\.[^/.]+$/, '.jpg'),
        order: pet.videos.length + uploadedVideos.length,
        createdAt: new Date(),
      });
    }

    // Enforce 30 video limit and evict oldest if necessary
    const updatedVideos = await enforceMediaLimitAndEvict(pet.videos, uploadedVideos, 30, 'video');

    pet.videos = updatedVideos;
    await pet.save();

    return res.status(200).json({
      message: `Uploaded ${uploadedVideos.length} video(s). Total videos: ${updatedVideos.length}/30.`,
      videos: pet.videos,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePetVideo = async (req, res, next) => {
  try {
    const { id, videoId } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const videoItem = pet.videos.id(videoId);
    if (!videoItem) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (videoItem.publicId) {
      deleteFromCloudinary(videoItem.publicId, 'video').catch(() => {});
    }

    pet.videos.pull({ _id: videoId });
    await pet.save();

    return res.status(200).json({
      message: 'Video deleted successfully.',
      videos: pet.videos,
    });
  } catch (error) {
    next(error);
  }
};
