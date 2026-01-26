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
    name: 'Essential Oversized Hoodie',
    slug: 'essential-oversized-hoodie',
    category: 'Hoodies',
    price: 185,
    description: 'Premium heavyweight cotton blend hoodie with oversized fit. Featuring dropped shoulders, ribbed cuffs, and a kangaroo pocket. The minimalist design embodies modern streetwear aesthetics.',
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
    name: 'Archive Logo Hoodie',
    slug: 'archive-logo-hoodie',
    category: 'Hoodies',
    price: 195,
    description: 'Signature hoodie featuring subtle embroidered branding. Crafted from premium French terry with a brushed interior for ultimate comfort. Contemporary silhouette with refined details.',
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
    name: 'Technical Zip Hoodie',
    slug: 'technical-zip-hoodie',
    category: 'Hoodies',
    price: 215,
    description: 'Performance-driven hoodie with full-length zip closure. Engineered with four-way stretch fabric and moisture-wicking properties. Features include adjustable drawstrings and concealed pockets.',
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
    name: 'Carpenter Cargo Pants',
    slug: 'carpenter-cargo-pants',
    category: 'Pants',
    price: 165,
    description: 'Utilitarian cargo pants with a modern cut. Multiple pockets with snap closures, reinforced knees, and adjustable waist tabs. Made from durable cotton canvas with a lived-in feel.',
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
    name: 'Tailored Track Pants',
    slug: 'tailored-track-pants',
    category: 'Pants',
    price: 145,
    description: 'Elevated track pants with a tailored aesthetic. Features include an elastic waistband with drawcord, side seam pockets, and tapered leg opening. Crafted from technical jersey fabric.',
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
    name: 'Core Oversized Tee',
    slug: 'core-oversized-tee',
    category: 'T-Shirts',
    price: 85,
    description: 'Essential oversized tee in premium heavyweight cotton. Features a relaxed fit with dropped shoulders and extended length. The perfect foundation piece for any wardrobe.',
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
    name: 'Graphic Print Tee',
    slug: 'graphic-print-tee',
    category: 'T-Shirts',
    price: 95,
    description: 'Statement tee featuring archive-inspired graphics. Constructed from soft-hand cotton with screen-printed details. Contemporary fit with reinforced neck ribbing and seamless shoulders.',
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
