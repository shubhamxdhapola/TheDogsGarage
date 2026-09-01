import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.enum(['Male', 'Female']),
  age: z.string().min(1, 'Age is required'),
  dateOfBirth: z.string().optional(),
  color: z.string().default('Golden'),
  size: z.enum(['Small', 'Medium', 'Large', 'Extra Large']).default('Medium'),
  weight: z.string().default('8kg'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  location: z.string().default('Bangalore, Karnataka'),
  vaccinationStatus: z.string().default('Up to date'),
  healthStatus: z.string().default('Excellent'),
  kciCertified: z.coerce.boolean().default(true),
  microchipNumber: z.string().optional().default(''),
  description: z.string().min(5, 'Description is required'),
  isAvailable: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});
