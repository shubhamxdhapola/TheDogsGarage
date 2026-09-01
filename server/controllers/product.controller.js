import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Review } from '../models/Review.js';
import { uploadBufferToCloudinary } from '../services/cloudinary.service.js';
import { createProductSchema } from '../validators/product.validator.js';

const generateProductSlug = (name) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base}-${Date.now().toString().slice(-4)}`;
};

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      search,
      sort = 'featured',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      products,
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

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      product,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1 });
    
    // Also aggregate counts per category from Products
    const categoryCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    categoryCounts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const result = categories.map((cat) => ({
      ...cat.toObject(),
      productCount: countMap[cat.name] || 0,
    }));

    return res.status(200).json({ categories: result });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const slug = generateProductSlug(validatedData.name);

    const product = await Product.create({
      ...validatedData,
      slug,
      images: req.body.images || [],
      features: req.body.features || [],
      ingredients: req.body.ingredients || [],
      benefits: req.body.benefits || [],
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImages = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images provided for upload.' });
    }

    const uploadedUrls = [];
    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'image',
        folder: 'the-dogs-garage/products',
      });
      uploadedUrls.push(result.secure_url);
    }

    return res.status(200).json({
      message: `Uploaded ${uploadedUrls.length} image(s).`,
      urls: uploadedUrls,
    });
  } catch (error) {
    next(error);
  }
};
