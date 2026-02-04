export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Hoodies' | 'Pants' | 'T-Shirts';
  price: number;
  description: string;
  images: string[];
  modelImages: string[];
  sizes: string[];
}

export const products: Product[] = [
  // Hoodies
  {
    id: 'hoodie-01',
    name: 'V1 Hoodie in Gunmetal Grey',
    slug: 'essential-oversized-hoodie',
    category: 'Hoodies',
    price: 185,
    description: 'The V1 Hoodie in Gunmetal Grey delivers a refined, understated look with premium heavyweight cotton and an oversized fit. Dropped shoulders, ribbed cuffs, and kangaroo pocket in a versatile grey that works with everything.',
    images: [
      '/products/hoodies/hoodie-01/DSC02427.JPG',
      '/products/hoodies/hoodie-01/DSC02430.JPG',
      '/products/hoodies/hoodie-01/DSC02431.JPG',
    ],
    modelImages: [
      '/models/hoodies/hoodie-01/DSC02487.JPG',
      '/models/hoodies/hoodie-01/DSC02488.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-02',
    name: 'V1 Hoodie in Carbon',
    slug: 'archive-logo-hoodie',
    category: 'Hoodies',
    price: 195,
    description: 'The V1 Hoodie in Carbon brings a sharp, modern edge in a deep carbon tone. Premium French terry with brushed interior, subtle branding, and a contemporary silhouette built for everyday wear.',
    images: [
      '/models/hoodies/hoodie-02/DSC02519.JPG',
      '/models/hoodies/hoodie-02/DSC02521.JPG',
      '/models/hoodies/hoodie-02/DSC02522.JPG',
    ],
    modelImages: [
      '/models/hoodies/hoodie-02/DSC02535.JPG',
      '/models/hoodies/hoodie-02/DSC02537.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-03',
    name: 'V1 Hoodie in Rust',
    slug: 'technical-zip-hoodie',
    category: 'Hoodies',
    price: 215,
    description: 'The V1 Hoodie in Rust offers a warm, distinctive look with a full-length zip and premium construction. Four-way stretch fabric, adjustable drawstrings, and concealed pockets in a standout rust finish.',
    images: [
      '/models/hoodies/hoodie-03/DSC02554.JPG',
      '/models/hoodies/hoodie-03/DSC02555.JPG',
      '/models/hoodies/hoodie-03/DSC02558.JPG',
    ],
    modelImages: [
      '/models/hoodies/hoodie-03/DSC02559.JPG',
      '/models/hoodies/hoodie-01/DSC02489.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Pants
  {
    id: 'pant-01',
    name: 'V1 Pants in Gunmetal',
    slug: 'carpenter-cargo-pants',
    category: 'Pants',
    price: 165,
    description: 'The V1 Pants in Gunmetal combine utility and style with a modern cut. Multiple pockets with snap closures, reinforced knees, and adjustable waist tabs in a durable gunmetal finish.',
    images: [
      '/models/pants/pant-01/DSC02554.JPG',
      '/models/pants/pant-01/DSC02555.JPG',
      '/models/pants/pant-01/DSC02558.JPG',
    ],
    modelImages: [
      '/models/pants/pant-01/DSC02559.JPG',
      '/models/hoodies/hoodie-03/DSC02554.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'pant-02',
    name: 'V1 Pants in Carbon',
    slug: 'tailored-track-pants',
    category: 'Pants',
    price: 145,
    description: 'The V1 Pants in Carbon deliver a clean, elevated look in deep carbon. Elastic waistband with drawcord, side seam pockets, and tapered leg in technical jersey for all-day comfort.',
    images: [
      '/models/hoodies/hoodie-02/DSC02521.JPG',
      '/models/hoodies/hoodie-02/DSC02522.JPG',
      '/models/hoodies/hoodie-02/DSC02535.JPG',
    ],
    modelImages: [
      '/models/hoodies/hoodie-01/DSC02491.JPG',
      '/models/hoodies/hoodie-01/DSC02488.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // T-Shirts
  {
    id: 'tshirt-01',
    name: 'V1 Sweats in Gunmetal Grey',
    slug: 'core-oversized-tee',
    category: 'T-Shirts',
    price: 85,
    description: 'The V1 Sweats in Gunmetal Grey offer a relaxed, versatile staple in premium heavyweight cotton. Dropped shoulders and extended length in a soft grey that layers with everything.',
    images: [
      '/models/tshirts/tshirt-01/DSC02494.JPG',
      '/models/tshirts/tshirt-01/DSC02498.JPG',
      '/products/hoodies/hoodie-01/DSC02575.JPG',
    ],
    modelImages: [
      '/models/tshirts/tshirt-01/DSC02494.JPG',
      '/models/tshirts/tshirt-01/DSC02498.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'tshirt-02',
    name: 'V1 Sweats in Rust',
    slug: 'graphic-print-tee',
    category: 'T-Shirts',
    price: 95,
    description: 'The V1 Sweats in Rust bring warmth and character in a standout rust tone. Soft-hand cotton, contemporary fit, and reinforced details for a piece that stands out without trying too hard.',
    images: [
      '/models/tshirts/tshirt-02/DSC02500.JPG',
      '/models/tshirts/tshirt-02/DSC02501.JPG',
      '/models/tshirts/tshirt-02/DSC02502.JPG',
    ],
    modelImages: [
      '/models/tshirts/tshirt-02/DSC02503.JPG',
      '/models/tshirts/tshirt-02/DSC02500.JPG',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'All') return products;
  return products.filter((product) => product.category === category);
};
