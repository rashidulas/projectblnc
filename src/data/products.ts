export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Hoodies' | 'Pants' | 'T-Shirts' | 'Sweats';
  price: number;
  description: string;
  images: string[];
  modelImages: string[];
  previewImage?: string;
  video?: string;
  sizes: string[];
}

export type ProductInput = Omit<Product, 'slug'> & {
  slug?: string;
};

export function slugifyProductName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function withProductSlug(product: ProductInput): Product {
  return {
    ...product,
    slug: slugifyProductName(product.name),
  };
}

const productSeed: ProductInput[] = [
  // Hoodies
  {
    id: 'hoodie-01',
    name: 'V1 Hoodie in Gunmetal Grey',
    category: 'Hoodies',
    price: 2500,
    description: 'The V1 Hoodie in Gunmetal Grey delivers a refined, understated look with premium heavyweight cotton and an oversized fit. Dropped shoulders, ribbed cuffs, and kangaroo pocket in a versatile grey that works with everything.',
    images: [
      '/models/hoodies/hoodie-01/gb_1.webp',
      '/models/hoodies/hoodie-01/gb_2.webp',
    ],
    modelImages: [
      '/models/hoodies/hoodie-01/gb_1.webp',
      '/models/hoodies/hoodie-01/gb_2.webp',
    ],
    previewImage: '/models/hoodies/hoodie-01/gb_1.webp',
    video: '/videos/hoodies/hoodie-01/g11.mp4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-02',
    name: 'V1 Hoodie in Carbon',
    category: 'Hoodies',
    price: 2500,
    description: 'The V1 Hoodie in Carbon brings a sharp, modern edge in a deep carbon tone. Premium French terry with brushed interior, subtle branding, and a contemporary silhouette built for everyday wear.',
    images: [
      '/models/hoodies/hoodie-02/black_1.webp',
      '/models/hoodies/hoodie-02/black_2.webp',
    ],
    modelImages: [
      '/models/hoodies/hoodie-02/black_1.webp',
      '/models/hoodies/hoodie-02/black_2.webp',
    ],
    previewImage: '/models/hoodies/hoodie-02/black_1.webp',
    video: '/videos/hoodies/hoodie-02/v11.mp4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-03',
    name: 'V1 Hoodie in Rust',
    category: 'Hoodies',
    price: 2500,
    description: 'The V1 Hoodie in Rust offers a warm, distinctive look with a full-length zip and premium construction. Four-way stretch fabric, adjustable drawstrings, and concealed pockets in a standout rust finish.',
    images: [
      '/models/hoodies/hoodie-03/mh_1.webp',
      '/models/hoodies/hoodie-03/mh_2.webp',
    ],
    modelImages: [
      '/models/hoodies/hoodie-03/mh_1.webp',
      '/models/hoodies/hoodie-03/mh_2.webp',
    ],
    previewImage: '/models/hoodies/hoodie-03/mh_1.webp',
    video: '/videos/hoodies/hoodie-03/m11.mp4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Pants
  {
    id: 'pant-01',
    name: 'V1 Pants in Gunmetal',
    category: 'Pants',
    price: 2000,
    description: 'The V1 Pants in Gunmetal combine utility and style with a modern cut. Multiple pockets with snap closures, reinforced knees, and adjustable waist tabs in a durable gunmetal finish.',
    images: [
      '/models/pants/pant-01/gg_1.webp',
      '/models/pants/pant-01/gg_2.webp',
    ],
    modelImages: [
      '/models/pants/pant-01/gg_1.webp',
      '/models/pants/pant-01/gg_2.webp',
    ],
    previewImage: '/models/pants/pant-01/gg_1.webp',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'pant-02',
    name: 'V1 Pants in Carbon',
    category: 'Pants',
    price:2000,
    description: 'The V1 Pants in Carbon deliver a clean, elevated look in deep carbon. Elastic waistband with drawcord, side seam pockets, and tapered leg in technical jersey for all-day comfort.',
    images: [
      '/models/hoodies/hoodie-02/black_1.webp',
      '/models/hoodies/hoodie-02/black_2.webp',
    ],
    modelImages: [
      '/models/hoodies/hoodie-02/black_1.webp',
      '/models/hoodies/hoodie-02/black_2.webp',
    ],
    previewImage: '/models/hoodies/hoodie-02/black_1.webp',
    
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Sweats
  {
    id: 'tshirt-01',
    name: 'V1 Sweats in Gunmetal Grey',
    category: 'Sweats',
    price: 2000,
    description: 'The V1 Sweats in Gunmetal Grey offer a relaxed, versatile staple in premium heavyweight cotton. Dropped shoulders and extended length in a soft grey that layers with everything.',
    images: [
      '/models/tshirts/tshirt-01/gs_1.webp',
      '/models/tshirts/tshirt-01/gs_2.webp',
    ],
    modelImages: [
      '/models/tshirts/tshirt-01/gs_1.webp',
      '/models/tshirts/tshirt-01/gs_2.webp',
    ],
    // Use the first product image as the preview so the listing and detail page match
    previewImage: '/models/tshirts/tshirt-01/gs_1.webp',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'tshirt-02',
    name: 'V1 Sweats in Rust',
    category: 'Sweats',
    price: 2000,
    description: 'The V1 Sweats in Rust bring warmth and character in a standout rust tone. Soft-hand cotton, contemporary fit, and reinforced details for a piece that stands out without trying too hard.',
    images: [
      '/models/tshirts/tshirt-02/mb_1.webp',
      '/models/tshirts/tshirt-02/mb_2.webp',
    ],
    modelImages: [
      '/models/tshirts/tshirt-02/mb_1.webp',
      '/models/tshirts/tshirt-02/mb_2.webp',
    ],
    // Ensure the grid uses a consistent still frame, while hover plays the video
    previewImage: '/models/tshirts/tshirt-02/mb_1.webp',
    video: '/models/tshirts/tshirt-02/v1.mp4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

export const products: Product[] = productSeed.map(withProductSlug);

export const getProductBySlug = (slug: string): Product | undefined => {
  const product = products.find((item) => item.slug === slug || slugifyProductName(item.name) === slug);
  return product ? withProductSlug(product) : undefined;
};

/** Use with a product list (e.g. from getProducts()) */
export function getProductBySlugFrom(list: ProductInput[], slug: string): Product | undefined {
  const product = list.find((item) => {
    const productSlug = item.slug ?? slugifyProductName(item.name);
    return productSlug === slug;
  });
  return product ? withProductSlug(product) : undefined;
}

export const getProductsByCategory = (category: string, productList?: Product[]): Product[] => {
  const list = productList ?? products;
  if (category === 'All') return list;
  return list.filter((product) => product.category === category);
};
