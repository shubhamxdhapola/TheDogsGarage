/**
 * Curated breed imagery utility for primary hero and secondary hover previews.
 * All image URLs are verified high-availability Unsplash assets.
 */
const BREED_IMAGE_MAP = [
  {
    matcher: (b) => b.includes('husky') || b.includes('siberian'),
    primary: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    matcher: (b) => b.includes('shepherd') || b.includes('german'),
    primary: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    matcher: (b) => b.includes('labrador') || b.includes('lab') || (b.includes('retriever') && !b.includes('golden')),
    primary: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    matcher: (b) => b.includes('golden'),
    primary: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    matcher: (b) => b.includes('shih'),
    primary: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    matcher: (b) => b.includes('beagle'),
    primary: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&h=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&h=800&q=80',
  },
];

export const DEFAULT_BREED_PAIR = {
  primary: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=800&h=800&q=80',
  secondary: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&h=800&q=80',
};

/**
 * Returns primary and hover secondary image URLs for a given breed name or index.
 */
export const getBreedImages = (breedName = '', index = 0) => {
  const normalized = (breedName || '').toLowerCase().trim();
  const matched = BREED_IMAGE_MAP.find((item) => item.matcher(normalized));
  if (matched) {
    return { primary: matched.primary, secondary: matched.secondary };
  }

  const fallback = BREED_IMAGE_MAP[index % BREED_IMAGE_MAP.length];
  return fallback
    ? { primary: fallback.primary, secondary: fallback.secondary }
    : DEFAULT_BREED_PAIR;
};

export default getBreedImages;
