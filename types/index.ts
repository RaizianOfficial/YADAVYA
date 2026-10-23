export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductSize {
  label: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductStatus = "draft" | "published";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  fabricCare: string;
  categoryId: string;
  tags: string[];
  images: ProductImage[];
  sizes: ProductSize[];
  colors?: ProductColor[];
  status: ProductStatus;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  coverImage?: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = "New" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  address: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: "COD" | "WHATSAPP";
  status: OrderStatus;
  createdAt: number;
}

export interface SiteSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
  };
  hero: {
    imageUrl?: string;
    headline: string;
    subtext: string;
    ctaLabel: string;
  };
  brandStatement: {
    text: string;
  };
  editorialBanner: {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
  };
  contactEmail: string;
  whatsappNumber: string;
  instagramUrl: string;
  shippingNote: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  image: string;
}
