import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Pet } from '../models/Pet.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thedogsgarage';

const seed = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Purging old data...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Pet.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log('Old records cleared. Seeding Users...');

    const [adminUser, customerUser, customer2, customer3, customer4] = await User.create([
      {
        name: 'The Dogs Garage',
        phone: '+916264369991',
        email: 'thedogsgarage@gmail.com',
        password: 'admin123@tdg.com',
        role: 'ADMIN',
        isVerified: true,
        addresses: [
          {
            name: 'TDG Headquarters',
            phone: '+919999999999',
            house: 'No. 42',
            street: '100ft Road, Indiranagar',
            area: 'Indiranagar',
            landmark: 'Opposite Metro Station',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
            type: 'WORK',
          },
        ],
      },
      {
        name: 'Rahul Sharma',
        phone: '+919876543210',
        email: 'rahulsharma@gmail.com',
        password: 'password123',
        role: 'CUSTOMER',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        addresses: [
          {
            name: 'Rahul Sharma',
            phone: '+919876543210',
            email: 'rahulsharma@gmail.com',
            house: '23',
            street: '4th Cross, HSR Layout',
            area: 'Sector 2',
            landmark: 'Near Urban Cafe',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560102',
            isDefault: true,
            type: 'HOME',
          },
        ],
      },
      {
        name: 'Priya Iyer',
        phone: '+919876543211',
        email: 'priya.iyer@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        addresses: [
          {
            name: 'Priya Iyer',
            phone: '+919876543211',
            house: 'Flat 4B, Silver Oak',
            street: 'Koramangala 5th Block',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Ankit Verma',
        phone: '+919876543212',
        email: 'ankit.v@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Neha Singh',
        phone: '+919876543213',
        email: 'neha.singh@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
      },
    ]);

    console.log('Seeding Categories...');
    const categories = await Category.create([
      { name: 'Dog Food', slug: 'dog-food', icon: 'Utensils', description: 'Dry kibble, wet food, and specialized diet for all dog breeds', displayOrder: 1 },
      { name: 'Shampoo & Grooming', slug: 'shampoo-grooming', icon: 'Sparkles', description: 'Coat cleansers, shampoos, conditioners, and grooming essentials', displayOrder: 2 },
      { name: 'Treats & Chews', slug: 'treats-chews', icon: 'Cookie', description: 'Delicious jerky, dental sticks, and training treats', displayOrder: 3 },
      { name: 'Toys', slug: 'toys', icon: 'Gamepad2', description: 'Durable rubber toys, rope bones, balls, and puzzle toys', displayOrder: 4 },
      { name: 'Grooming', slug: 'grooming-tools', icon: 'Scissors', description: 'De-shedding tools, slicker brushes, and nail trimmers', displayOrder: 5 },
      { name: 'Supplements', slug: 'supplements', icon: 'Pill', description: 'Calcium, joint support, multivitamins, and omega-3 fish oils', displayOrder: 6 },
      { name: 'Fragrances', slug: 'fragrances', icon: 'Spray', description: 'Deodorizing pet mists, long-lasting colognes, and refreshing sprays', displayOrder: 7 },
      { name: 'Accessories', slug: 'accessories', icon: 'ShoppingBag', description: 'Leashes, harnesses, stainless bowls, and orthopedic beds', displayOrder: 8 },
    ]);

    console.log('Seeding Live Stock Pets with 4 dogs, 4 square images each...');

    const huskyPhotos = [
      { url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 1 },
      { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 2 },
      { url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 3 },
      { url: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 4 },
    ];

    const germanShepherdPhotos = [
      { url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 1 },
      { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 2 },
      { url: 'https://images.unsplash.com/photo-1588774069410-84ae30757c8e?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 3 },
      { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 4 },
    ];

    const labradorPhotos = [
      { url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 1 },
      { url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 2 },
      { url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 3 },
      { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 4 },
    ];

    const goldenPhotos = [
      { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 1 },
      { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 2 },
      { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 3 },
      { url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=1000&h=1000&q=80', publicId: '', order: 4 },
    ];

    const sampleVideos = [
      {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-dog-catching-a-ball-in-a-park-1481-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&h=400&q=80',
        caption: 'Playing fetch at 3 months',
        order: 1,
      },
      {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-little-dog-walking-on-the-grass-43890-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=400&q=80',
        caption: 'Outdoor socialization walk',
        order: 2,
      },
      {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-petting-a-cute-puppy-in-her-hands-43888-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&h=400&q=80',
        caption: 'Cuddle session with handler',
        order: 3,
      },
      {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-brown-dog-relaxing-on-the-grass-43893-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&h=400&q=80',
        caption: 'Gentle temperament test',
        order: 4,
      },
    ];

    const petsData = [
      {
        name: 'Shadow',
        slug: 'siberian-husky-shadow-001',
        breed: 'Siberian Husky',
        gender: 'Male',
        age: '2 Months',
        color: 'Black & White',
        size: 'Large',
        weight: '7kg',
        price: 28000,
        location: 'Bangalore, Karnataka',
        vaccinationStatus: 'Up to date',
        healthStatus: 'Excellent',
        kciCertified: true,
        microchipNumber: '987654321019787',
        description: 'Stunning bi-eyed Siberian Husky male puppy. Majestic coat, playful vocal personality, 42-point vet checked and raised in a healthy home environment.',
        images: huskyPhotos,
        videos: sampleVideos.slice(0, 2),
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Thor',
        slug: 'german-shepherd-thor-002',
        breed: 'German Shepherd',
        gender: 'Male',
        age: '3 Months',
        color: 'Black & Tan',
        size: 'Large',
        weight: '9kg',
        price: 25000,
        location: 'Bangalore, Karnataka',
        vaccinationStatus: 'Up to date',
        healthStatus: 'Excellent',
        kciCertified: true,
        microchipNumber: '987654321019788',
        description: 'Broad bone, heavy double-coat German Shepherd male puppy. Intelligent, courageous, excellent guard and affectionate family temperament.',
        images: germanShepherdPhotos,
        videos: sampleVideos.slice(0, 2),
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Leo',
        slug: 'labrador-retriever-leo-003',
        breed: 'Labrador Retriever',
        gender: 'Male',
        age: '2.5 Months',
        color: 'Yellow',
        size: 'Large',
        weight: '7.5kg',
        price: 22000,
        location: 'Bangalore, Karnataka',
        vaccinationStatus: 'Up to date',
        healthStatus: 'Excellent',
        kciCertified: true,
        microchipNumber: '987654321019789',
        description: 'Classic English-type Yellow Labrador puppy. Champion bloodline, very eager to please, loving companion for families and children.',
        images: labradorPhotos,
        videos: sampleVideos.slice(0, 2),
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Rocky',
        slug: 'golden-retriever-rocky-004',
        breed: 'Golden Retriever',
        gender: 'Male',
        age: '3 Months',
        color: 'Golden',
        size: 'Large',
        weight: '8kg',
        price: 32000,
        location: 'Bangalore, Karnataka',
        vaccinationStatus: 'Up to date',
        healthStatus: 'Excellent',
        kciCertified: true,
        microchipNumber: '987654321019785',
        description: 'Playful, friendly and full of love! Our Golden Retriever puppy is vet checked, fully vaccinated and raised with gentle care. Perfect family pet.',
        images: goldenPhotos,
        videos: sampleVideos.slice(0, 2),
        isAvailable: true,
        isFeatured: true,
      },
    ];

    await Pet.create(petsData);

    console.log('Seeding 30+ Accessories Products...');
    const defaultProductImage = '/images/product-shampoo.jpg';

    const productsData = [
      {
        name: 'TDG Live UPI Test Item – ₹1 Only',
        slug: 'tdg-live-upi-test-item-1rs',
        sku: 'TDG-TEST-001',
        category: 'Accessories',
        description: 'Special ₹1 test product for live online payment testing via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking.',
        price: 1,
        originalPrice: 10,
        discount: 90,
        stock: 999,
        rating: 5.0,
        numReviews: 99,
        images: [defaultProductImage],
        features: [
          'Instant ₹1 test transaction',
          'Supports all UPI Apps & Cards',
          'Live Razorpay Gateway verification',
        ],
        packageSize: '1 Test Unit',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'The Dogs Garage Premium Dog Shampoo 250ml',
        slug: 'tdg-premium-dog-shampoo-250ml',
        sku: 'TDG-SH-250',
        category: 'Shampoo & Grooming',
        description: 'Clean coat, happy dog! Premium care for a clean, healthy & happy dog with natural ingredients, deep cleanse & moisturize, gentle & safe, vet approved. Relieves dry, itchy skin, conditions & moisturizes, soothes sensitive skin.',
        price: 650,
        originalPrice: 850,
        discount: 24,
        stock: 45,
        rating: 5.0,
        numReviews: 148,
        images: [defaultProductImage],
        features: [
          'Natural ingredients & plant-based cleansers',
          'Deep cleanse & long-lasting moisturization',
          'Gentle, safe, tearless pH-balanced formula',
          '100% Vet approved, paraben & sulfate free',
        ],
        ingredients: ['Colloidal Oatmeal', 'Aloe Vera Leaf Juice', 'Coconut Oil Extract', 'Hydrolyzed Silk Protein', 'Vitamin E'],
        benefits: ['Relieves dry, itchy skin', 'Conditions & moisturizes coat', 'Soothes sensitive skin with instant itch relief'],
        usage: 'Wet coat thoroughly with warm water. Apply shampoo generously, massage gently into lather, leave on for 3-5 minutes, then rinse thoroughly.',
        packageSize: '250ml Bottle',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Royal Canin Puppy Food – 3kg',
        slug: 'royal-canin-puppy-food-3kg',
        sku: 'RC-PUP-3KG',
        category: 'Dog Food',
        description: 'Complete and balanced food for puppies up to 12 months old. Supports healthy growth, digestive health and a strong immune system.',
        price: 1450,
        originalPrice: 1650,
        discount: 20,
        stock: 25,
        rating: 4.8,
        numReviews: 126,
        images: [defaultProductImage],
        features: [
          'Supports healthy growth',
          'Strong immune system with antioxidant complex',
          'Digestive health support with prebiotics',
          'High-quality L.I.P. protein formulation',
        ],
        ingredients: ['Dehydrated poultry protein', 'Rice', 'Animal fats', 'Maize', 'Vegetable protein isolate', 'Beet pulp', 'Fish oil'],
        benefits: ['Optimal energy content for active growing puppies', 'Maintains delicate digestive microflora balance'],
        usage: 'Feed twice daily according to the feeding guideline chart on the pack.',
        packageSize: '3kg Bag',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Furminator Deshedding Spray 250ml',
        slug: 'furminator-deshedding-spray-250ml',
        sku: 'FM-SPR-250',
        category: 'Grooming',
        description: 'Professional waterless deshedding conditioning spray to reduce excess shedding and loosen dead undercoat.',
        price: 750,
        originalPrice: 950,
        discount: 21,
        stock: 14,
        rating: 4.7,
        numReviews: 62,
        images: [defaultProductImage],
        packageSize: '250ml Spray Bottle',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Pedigree Meat Jerky Treats 200g',
        slug: 'pedigree-meat-jerky-treats-200g',
        sku: 'PD-JTY-200',
        category: 'Treats & Chews',
        description: 'Chewy and tender grilled beef jerky strips packed with real meat taste. Ideal for rewarding during obedience training.',
        price: 280,
        originalPrice: 350,
        discount: 20,
        stock: 32,
        rating: 4.6,
        numReviews: 95,
        images: [defaultProductImage],
        packageSize: '200g Pouch',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Dog Toy Rope Bone Dental Chew',
        slug: 'dog-toy-rope-bone',
        sku: 'DT-RB-001',
        category: 'Toys',
        description: 'High-density 100% natural braided cotton rope toy with dual knot handles. Excellent for dental hygiene and tug-of-war.',
        price: 350,
        originalPrice: 450,
        discount: 22,
        stock: 28,
        rating: 4.8,
        numReviews: 53,
        images: [defaultProductImage],
        packageSize: 'Medium (30cm)',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Drools Absolute Calcium Tablets 110 Tabs',
        slug: 'drools-absolute-calcium-tablets',
        sku: 'DR-CAL-110',
        category: 'Supplements',
        description: 'Enriched calcium and phosphorus formulation supporting strong bones, teeth and joint development in dogs of all ages.',
        price: 480,
        originalPrice: 600,
        discount: 20,
        stock: 40,
        rating: 4.9,
        numReviews: 110,
        images: [defaultProductImage],
        packageSize: '110 Tablets Tub',
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Kong Classic Chew Toy (Large)',
        slug: 'kong-classic-chew-toy-large',
        sku: 'KG-CL-01',
        category: 'Toys',
        description: 'Ultra-durable natural red rubber bouncing toy that satisfies instinctual chewing urges and mental stimulation.',
        price: 890,
        originalPrice: 1050,
        discount: 15,
        stock: 19,
        rating: 5.0,
        numReviews: 142,
        images: [defaultProductImage],
        packageSize: 'Large',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Beaphar Salmon Oil 430ml',
        slug: 'beaphar-salmon-oil-430ml',
        sku: 'BP-SL-430',
        category: 'Supplements',
        description: 'Pure cold-pressed wild Atlantic salmon oil rich in EPA and DHA Omega 3 & 6 fatty acids for a lustrous shiny coat.',
        price: 1150,
        originalPrice: 1400,
        discount: 18,
        stock: 22,
        rating: 4.9,
        numReviews: 76,
        images: [defaultProductImage],
        packageSize: '430ml Bottle',
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Captain Zack Barking Up The Tea Tree Shampoo',
        slug: 'captain-zack-tea-tree-shampoo-250ml',
        sku: 'CZ-TT-250',
        category: 'Shampoo & Grooming',
        description: 'Anti-microbial and antifungal tea tree oil formulation that repels ticks, fleas and eases skin irritation naturally.',
        price: 540,
        originalPrice: 680,
        discount: 20,
        stock: 15,
        rating: 4.7,
        numReviews: 48,
        images: [defaultProductImage],
        packageSize: '250ml',
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'JerHigh Roasted Duck Dog Treats 70g',
        slug: 'jerhigh-roasted-duck-treats-70g',
        sku: 'JH-RD-70',
        category: 'Treats & Chews',
        description: 'Real roasted duck meat sticks filled with vitamin E and collagen for skin elasticity and overall vitality.',
        price: 220,
        originalPrice: 280,
        discount: 21,
        stock: 50,
        rating: 4.8,
        numReviews: 89,
        images: [defaultProductImage],
        packageSize: '70g Pouch',
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Pet Head Poof Deodorizing Spray 450ml',
        slug: 'pet-head-poof-deodorizing-spray',
        sku: 'PH-PF-450',
        category: 'Fragrances',
        description: 'Instant freshening spray with strawberry yogurt fragrance. Neutralizes stubborn pet odor without harsh chemicals.',
        price: 790,
        originalPrice: 990,
        discount: 20,
        stock: 16,
        rating: 4.8,
        numReviews: 39,
        images: [defaultProductImage],
        packageSize: '450ml Spray',
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Orthopedic Memory Foam Pet Bed (XL)',
        slug: 'orthopedic-memory-foam-pet-bed-xl',
        sku: 'TDG-BED-XL',
        category: 'Accessories',
        description: 'High-density orthopedic memory foam core with water-resistant liner and machine-washable plush velour cover.',
        price: 3499,
        originalPrice: 4200,
        discount: 17,
        stock: 8,
        rating: 4.9,
        numReviews: 31,
        images: [defaultProductImage],
        packageSize: 'XL (105 x 75 cm)',
        isFeatured: true,
        isActive: true,
      },
    ];

    const seededProducts = await Product.create(productsData);

    console.log('Seeding Demo Orders matching admin reference table...');
    const now = Date.now();
    const demoOrders = [
      {
        orderId: 'TDG-84920',
        user: customerUser._id,
        items: [
          {
            product: seededProducts[1]._id,
            name: seededProducts[1].name,
            sku: seededProducts[1].sku,
            image: seededProducts[1].images[0],
            price: 650,
            originalPrice: 850,
            quantity: 1,
            total: 650,
          },
          {
            product: seededProducts[2]._id,
            name: seededProducts[2].name,
            sku: seededProducts[2].sku,
            image: seededProducts[2].images[0],
            price: 1450,
            originalPrice: 1650,
            quantity: 1,
            total: 1450,
          },
        ],
        shippingAddress: {
          name: 'Rohit Sharma',
          phone: '+91 98765 43210',
          email: 'rohitsharma@gmail.com',
          house: '23',
          street: 'Green Park Layout, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          landmark: 'Near Community Park',
        },
        subtotal: 2100,
        discount: 400,
        deliveryCharge: 0,
        total: 2100,
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        orderStatus: 'DELIVERED',
        createdAt: new Date(now - 1 * 86400000),
        statusHistory: [
          { status: 'PLACED', timestamp: new Date(now - 4 * 86400000) },
          { status: 'PROCESSING', timestamp: new Date(now - 3 * 86400000) },
          { status: 'SHIPPED', timestamp: new Date(now - 2 * 86400000) },
          { status: 'DELIVERED', timestamp: new Date(now - 1 * 86400000) },
        ],
      },
      {
        orderId: 'TDG-84919',
        user: customer2._id,
        items: [
          {
            product: seededProducts[2]._id,
            name: seededProducts[2].name,
            sku: seededProducts[2].sku,
            image: seededProducts[2].images[0],
            price: 1450,
            quantity: 1,
            total: 1450,
          },
        ],
        shippingAddress: {
          name: 'Priya Iyer',
          phone: '+91 98765 43211',
          house: 'Flat 4B',
          street: 'Koramangala 5th Block',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
        },
        subtotal: 1450,
        discount: 0,
        deliveryCharge: 0,
        total: 1450,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
        createdAt: new Date(now - 2 * 86400000),
      },
      {
        orderId: 'TDG-84918',
        user: customer3._id,
        items: [
          {
            product: seededProducts[11]._id,
            name: seededProducts[11].name,
            price: 3250,
            quantity: 1,
            total: 3250,
          },
        ],
        shippingAddress: {
          name: 'Ankit Verma',
          phone: '+91 98765 43212',
          house: '12A',
          street: 'Indiranagar 100ft Rd',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
        },
        subtotal: 3250,
        discount: 0,
        deliveryCharge: 0,
        total: 3250,
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        orderStatus: 'SHIPPED',
        createdAt: new Date(now - 4 * 86400000),
      },
      {
        orderId: 'TDG-84917',
        user: customer4._id,
        items: [
          {
            product: seededProducts[1]._id,
            name: seededProducts[1].name,
            price: 650,
            quantity: 1,
            total: 650,
          },
          {
            product: seededProducts[9]._id,
            name: seededProducts[9].name,
            price: 200,
            quantity: 1,
            total: 200,
          },
        ],
        shippingAddress: {
          name: 'Neha Singh',
          phone: '+91 98765 43213',
          house: '77',
          street: 'Richmond Town',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560025',
        },
        subtotal: 850,
        discount: 0,
        deliveryCharge: 0,
        total: 850,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PLACED',
        createdAt: new Date(now - 6 * 86400000),
      },
      {
        orderId: 'TDG-84916',
        user: customerUser._id,
        items: [
          {
            product: seededProducts[3]._id,
            name: seededProducts[3].name,
            price: 750,
            quantity: 2,
            total: 1500,
          },
        ],
        shippingAddress: {
          name: 'Rohit Sharma',
          phone: '+91 98765 43210',
          house: '23',
          street: 'Green Park Layout, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
        },
        subtotal: 1500,
        discount: 0,
        deliveryCharge: 0,
        total: 1500,
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        orderStatus: 'DELIVERED',
        createdAt: new Date(now - 10 * 86400000),
      },
      {
        orderId: 'TDG-84915',
        user: customer2._id,
        items: [
          {
            product: seededProducts[5]._id,
            name: seededProducts[5].name,
            price: 890,
            quantity: 1,
            total: 890,
          },
        ],
        shippingAddress: {
          name: 'Priya Iyer',
          phone: '+91 98765 43211',
          house: 'Flat 4B',
          street: 'Koramangala 5th Block',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
        },
        subtotal: 890,
        discount: 0,
        deliveryCharge: 0,
        total: 890,
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        orderStatus: 'DELIVERED',
        createdAt: new Date(now - 15 * 86400000),
      },
    ];

    await Order.create(demoOrders);

    console.log('\n=============================================');
    console.log('✅ [THE DOGS GARAGE] Database Seed Completed!');
    console.log('Admin Account:');
    console.log('  Phone: +919999999999 (or 9999999999)');
    console.log('  Password: adminpassword123');
    console.log('Customer Account:');
    console.log('  Phone: +919876543210 (or 9876543210)');
    console.log('  Password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
