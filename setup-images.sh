#!/bin/bash

# Project BLNC - Image Folder Setup Script
# This script creates all the necessary image folders

echo "🎨 Setting up Project BLNC image folders..."

# Create hero folder
mkdir -p public/hero
echo "✅ Created public/hero/"

# Create product image folders - Hoodies
mkdir -p public/products/hoodies/hoodie-01
mkdir -p public/products/hoodies/hoodie-02
mkdir -p public/products/hoodies/hoodie-03
echo "✅ Created hoodie product folders"

# Create product image folders - Pants
mkdir -p public/products/pants/pant-01
mkdir -p public/products/pants/pant-02
echo "✅ Created pants product folders"

# Create product image folders - T-Shirts
mkdir -p public/products/tshirts/tshirt-01
mkdir -p public/products/tshirts/tshirt-02
echo "✅ Created t-shirt product folders"

# Create model image folders - Hoodies
mkdir -p public/models/hoodies/hoodie-01
mkdir -p public/models/hoodies/hoodie-02
mkdir -p public/models/hoodies/hoodie-03
echo "✅ Created hoodie model folders"

# Create model image folders - Pants
mkdir -p public/models/pants/pant-01
mkdir -p public/models/pants/pant-02
echo "✅ Created pants model folders"

# Create model image folders - T-Shirts
mkdir -p public/models/tshirts/tshirt-01
mkdir -p public/models/tshirts/tshirt-02
echo "✅ Created t-shirt model folders"

echo ""
echo "🎉 All image folders created successfully!"
echo ""
echo "📸 Next steps:"
echo "1. Add your hero image to: public/hero/hero.jpg"
echo "2. Add 3 product images (01.jpg, 02.jpg, 03.jpg) to each product folder"
echo "3. Add 2 model images (01.jpg, 02.jpg) to each model folder"
echo ""
echo "📄 See IMAGE_SETUP.md for detailed instructions"
echo ""
echo "🚀 Run 'npm install' and 'npm run dev' to start the dev server"
