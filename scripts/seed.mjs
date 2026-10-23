import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBINR7cIBPFXzlmB4LxYUliviiwFzrlJB8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "yadavya-1f900.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yadavya-1f900",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "588192130188",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:588192130188:web:219b905320fd763e5507a9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  {
    id: "cat_shirts",
    name: "Shirts & Overshirts",
    slug: "shirts-overshirts",
    order: 1,
    coverImage: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat_trousers",
    name: "Trousers & Tailoring",
    slug: "trousers-tailoring",
    order: 2,
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat_outerwear",
    name: "Outerwear & Layers",
    slug: "outerwear-layers",
    order: 3,
    coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  },
];

const now = Date.now();

const products = [
  {
    id: "prod_01",
    slug: "architectural-linen-overshirt",
    name: "Architectural Linen Overshirt",
    price: 4800,
    compareAtPrice: 5600,
    shortDescription: "Cut from heavy unbleached Belgian linen with clean dropped shoulders.",
    description: "An intentional study in proportion and drape. Crafted in 380gsm unbleached Belgian linen, the Architectural Overshirt features concealed horn buttoning, deep split side seams, and a relaxed dropped shoulder line designed to hold form while moving effortlessly.",
    fabricCare: "100% Raw Belgian Flax Linen. Dry clean or gentle cold wash with neutral soap. Line dry in shade.",
    categoryId: "cat_shirts",
    tags: ["linen", "shirt", "overshirt", "natural", "tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        alt: "Architectural Linen Overshirt Front View",
      },
      {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
        alt: "Architectural Linen Overshirt Profile View",
      },
    ],
    sizes: [
      { label: "S", stock: 6 },
      { label: "M", stock: 12 },
      { label: "L", stock: 8 },
      { label: "XL", stock: 4 },
    ],
    colors: [
      { name: "Unbleached Bone", hex: "#EBE7DF" },
      { name: "Raw Slate", hex: "#3A444C" },
    ],
    status: "published",
    featured: true,
    createdAt: now - 1000 * 60 * 60 * 24 * 7,
    updatedAt: now,
  },
  {
    id: "prod_02",
    slug: "sculpted-pleat-trouser",
    name: "Sculpted Pleat Trouser",
    price: 5200,
    compareAtPrice: null,
    shortDescription: "Wide-leg fluid silhouette with deep inward front pleats and extended tab closure.",
    description: "Tailored from high-twist tropical virgin wool, these trousers balance an architectural high-rise waist with an expansive, relaxed leg. Finished with discreet side adjusters and hand-finished hems.",
    fabricCare: "100% High-Twist Tropical Virgin Wool. Specialist dry clean only.",
    categoryId: "cat_trousers",
    tags: ["trouser", "wool", "tailoring", "pleated"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80",
        alt: "Sculpted Pleat Trouser Full View",
      },
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
        alt: "Sculpted Pleat Trouser Silhouette",
      },
    ],
    sizes: [
      { label: "XS", stock: 4 },
      { label: "S", stock: 9 },
      { label: "M", stock: 11 },
      { label: "L", stock: 7 },
    ],
    colors: [
      { name: "Charcoal Ink", hex: "#1C242B" },
      { name: "Muted Sand", hex: "#D8D2C5" },
    ],
    status: "published",
    featured: true,
    createdAt: now - 1000 * 60 * 60 * 24 * 6,
    updatedAt: now,
  },
  {
    id: "prod_03",
    slug: "monolith-cocoon-coat",
    name: "Monolith Cocoon Coat",
    price: 12400,
    compareAtPrice: 14000,
    shortDescription: "Double-faced wool cashmere blend coat with concealed storm placket.",
    description: "An unlined, double-faced overcoat constructed by hand using split-seam tailoring. Features a minimal stand collar, generous raglan sleeves, and deep welt pockets lined in brushed silk-cotton.",
    fabricCare: "90% Virgin Wool, 10% Cashmere. Delicate dry clean only.",
    categoryId: "cat_outerwear",
    tags: ["coat", "outerwear", "wool", "cashmere", "winter"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80",
        alt: "Monolith Cocoon Coat Front",
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        alt: "Monolith Cocoon Coat Mood",
      },
    ],
    sizes: [
      { label: "S", stock: 3 },
      { label: "M", stock: 5 },
      { label: "L", stock: 4 },
    ],
    colors: [
      { name: "Obsidian", hex: "#0E1A24" },
      { name: "Camel Clay", hex: "#B89F82" },
    ],
    status: "published",
    featured: true,
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    updatedAt: now,
  },
  {
    id: "prod_04",
    slug: "mercerized-cotton-tunic-tee",
    name: "Mercerized Cotton Tunic Tee",
    price: 2400,
    compareAtPrice: null,
    shortDescription: "Heavyweight 280gsm Japanese jersey tee with structured mock neck.",
    description: "A substantial, fluid t-shirt knit from long-staple Suvin cotton yarns with a silk-like mercerized finish. Features a neat 1-inch neck binding and blind-stitched hem details.",
    fabricCare: "100% Suvin Cotton. Machine wash delicate in cold water. Lay flat to dry.",
    categoryId: "cat_shirts",
    tags: ["cotton", "tee", "tshirt", "minimal"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
        alt: "Mercerized Cotton Tunic Tee",
      },
      {
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
        alt: "Tee Fabric Detail",
      },
    ],
    sizes: [
      { label: "XS", stock: 5 },
      { label: "S", stock: 15 },
      { label: "M", stock: 20 },
      { label: "L", stock: 12 },
      { label: "XL", stock: 8 },
    ],
    colors: [
      { name: "Chalk White", hex: "#F7F6F2" },
      { name: "Deep Ink", hex: "#0E1A24" },
    ],
    status: "published",
    featured: true,
    createdAt: now - 1000 * 60 * 60 * 24 * 4,
    updatedAt: now,
  },
  {
    id: "prod_05",
    slug: "raw-silk-camp-collar-shirt",
    name: "Raw Silk Camp Collar Shirt",
    price: 4200,
    compareAtPrice: null,
    shortDescription: "Hand-spun Matka raw silk shirt with relaxed camp collar and mother-of-pearl buttons.",
    description: "Cut from textured slub hand-spun Matka silk sourced directly from master weavers. The shirt has a calm, porous texture that breathes beautifully in high heat while offering tactile character.",
    fabricCare: "100% Hand-Spun Matka Silk. Gentle cold hand wash or eco dry clean.",
    categoryId: "cat_shirts",
    tags: ["silk", "camp collar", "shirt", "artisan"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
        alt: "Raw Silk Camp Collar Shirt",
      },
      {
        url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
        alt: "Camp Collar Detail",
      },
    ],
    sizes: [
      { label: "S", stock: 7 },
      { label: "M", stock: 9 },
      { label: "L", stock: 6 },
    ],
    colors: [{ name: "Raw Ecru", hex: "#E8E2D5" }],
    status: "published",
    featured: false,
    createdAt: now - 1000 * 60 * 60 * 24 * 3,
    updatedAt: now,
  },
  {
    id: "prod_06",
    slug: "relaxed-poplin-field-pant",
    name: "Relaxed Poplin Field Pant",
    price: 3900,
    compareAtPrice: null,
    shortDescription: "High-density crisp cotton poplin with elasticated back waist and articulated knee darts.",
    description: "Designed for day-long ease without losing posture. Constructed from compact Japanese typewriter cloth that holds crisp volume. Finished with slash pockets and an internal drawstring.",
    fabricCare: "100% Compact Cotton Typewriter Cloth. Cold wash, line dry.",
    categoryId: "cat_trousers",
    tags: ["pant", "poplin", "trouser", "casual"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80",
        alt: "Relaxed Poplin Field Pant",
      },
      {
        url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80",
        alt: "Field Pant Fit",
      },
    ],
    sizes: [
      { label: "S", stock: 8 },
      { label: "M", stock: 14 },
      { label: "L", stock: 10 },
      { label: "XL", stock: 5 },
    ],
    colors: [
      { name: "Washed Olive", hex: "#4A5243" },
      { name: "Dark Navy", hex: "#16202B" },
    ],
    status: "published",
    featured: false,
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
    updatedAt: now,
  },
  {
    id: "prod_07",
    slug: "boiled-wool-kimono-jacket",
    name: "Boiled Wool Kimono Jacket",
    price: 7800,
    compareAtPrice: 8900,
    shortDescription: "Dense boiled merino wool jacket with wrap front and raw edge finish.",
    description: "Unstructured, thermal, and weightless. Crafted from pure Australian merino wool boiled in cold mountain water to achieve dense wind resistance. Cut with an overlapping wrap front and tie closure.",
    fabricCare: "100% Boiled Merino Wool. Dry clean or spot clean with natural wool brush.",
    categoryId: "cat_outerwear",
    tags: ["wool", "jacket", "kimono", "outerwear"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
        alt: "Boiled Wool Kimono Jacket",
      },
      {
        url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
        alt: "Kimono Jacket Back Detail",
      },
    ],
    sizes: [
      { label: "S", stock: 4 },
      { label: "M", stock: 8 },
      { label: "L", stock: 6 },
    ],
    colors: [{ name: "Cast Iron", hex: "#222629" }],
    status: "published",
    featured: false,
    createdAt: now - 1000 * 60 * 60 * 24 * 1,
    updatedAt: now,
  },
  {
    id: "prod_08",
    slug: "tailored-linen-wrap-vest",
    name: "Tailored Linen Wrap Vest",
    price: 3600,
    compareAtPrice: null,
    shortDescription: "Sleeveless waistcoat in structured Irish linen with asymmetric front closure.",
    description: "A versatile layering piece designed to be worn alone against the skin or over crisp tunics. Features hand-worked buttonholes, a tailored back cinch, and pure cotton lining.",
    fabricCare: "100% Irish Linen. Specialist dry clean.",
    categoryId: "cat_outerwear",
    tags: ["vest", "linen", "waistcoat", "tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1200&q=80",
        alt: "Tailored Linen Wrap Vest",
      },
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
        alt: "Wrap Vest Details",
      },
    ],
    sizes: [
      { label: "XS", stock: 3 },
      { label: "S", stock: 6 },
      { label: "M", stock: 8 },
      { label: "L", stock: 5 },
    ],
    colors: [
      { name: "Oatmeal", hex: "#DDD6C7" },
      { name: "Charcoal", hex: "#292E34" },
    ],
    status: "published",
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
];

async function seedDatabase() {
  console.log("Seeding YADAVYA categories and products...");

  for (const cat of categories) {
    const ref = doc(db, "categories", cat.id);
    await setDoc(ref, cat);
    console.log(`Seeded category: ${cat.name}`);
  }

  for (const prod of products) {
    const ref = doc(db, "products", prod.id);
    await setDoc(ref, prod);
    console.log(`Seeded product: ${prod.name}`);
  }

  console.log("Database seeded successfully with 8 luxury garments and 3 categories.");
}

seedDatabase().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
