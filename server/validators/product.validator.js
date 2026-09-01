import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  originalPrice: z.coerce.number().optional(),
  discount: z.coerce.number().default(0),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  rating: z.coerce.number().default(4.8),
  packageSize: z.string().default('1 unit'),
  isFeatured: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  usage: z.string().optional().default(''),
});
