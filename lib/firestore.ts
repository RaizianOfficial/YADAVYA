import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { slugify } from "./formatters";
import type {
  Product,
  Category,
  Order,
  OrderStatus,
  SiteSettings,
} from "@/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementBar: {
    enabled: true,
    text: "COMPLIMENTARY SHIPPING ACROSS INDIA ON ALL ORDERS",
  },
  hero: {
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80",
    headline: "Quiet form. Measured presence.",
    subtext: "An intentional study in silhouette and raw proportion.",
    ctaLabel: "Shop the collection",
  },
  brandStatement: {
    text: "YADAVYA exists in the quiet cadence between architectural precision and unadorned material. Every garment is an exercise in restraint—cut with disciplined proportion, tailored for longevity, and stripped of transient ornamentation.",
  },
  editorialBanner: {
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",
    title: "Edition 01 / Monolith",
    subtitle:
      "Explorations in hand-loomed texture and relaxed architectural tailoring.",
  },
  contactEmail: "concierge@yadavya.com",
  whatsappNumber: "919876543210",
  instagramUrl: "https://instagram.com/yadavya",
  shippingNote:
    "Orders dispatched within 24-48 hours. Delivered nationwide within 3-5 business days.",
};

// ---------------- Site Settings ----------------

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, "settings", "site");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...(snapshot.data() as Partial<SiteSettings>) };
    }
  } catch (error) {
    console.error("Error fetching site settings:", error);
  }
  return DEFAULT_SITE_SETTINGS;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  const docRef = doc(db, "settings", "site");
  await setDoc(docRef, settings, { merge: true });
}

// ---------------- Products ----------------

export async function getProducts(options?: {
  status?: "published" | "draft";
  featured?: boolean;
  categoryId?: string;
  limitCount?: number;
}): Promise<Product[]> {
  try {
    // Only use single field filter in Firestore query to avoid requiring composite indexes
    const constraints: QueryConstraint[] = [];
    if (options?.status) {
      constraints.push(where("status", "==", options.status));
    }

    const q = constraints.length > 0
      ? query(collection(db, "products"), ...constraints)
      : query(collection(db, "products"));

    const snapshot = await getDocs(q);

    let list = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Product, "id">),
    }));

    if (options?.status) {
      list = list.filter((p) => p.status === options.status);
    }
    if (options?.featured !== undefined) {
      list = list.filter((p) => p.featured === options.featured);
    }
    if (options?.categoryId) {
      list = list.filter((p) => p.categoryId === options.categoryId);
    }

    // Sort in memory by newest first
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (options?.limitCount) {
      list = list.slice(0, options.limitCount);
    }

    return list;
  } catch (error) {
    console.error("Error fetching products:", error);
    try {
      const qFallback = query(collection(db, "products"));
      const snapshot = await getDocs(qFallback);
      let list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }));
      if (options?.status) {
        list = list.filter((p) => p.status === options.status);
      }
      if (options?.featured !== undefined) {
        list = list.filter((p) => p.featured === options.featured);
      }
      if (options?.categoryId) {
        list = list.filter((p) => p.categoryId === options.categoryId);
      }
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      if (options?.limitCount) {
        list = list.slice(0, options.limitCount);
      }
      return list;
    } catch (fallbackError) {
      console.error("Fallback error fetching products:", fallbackError);
      return [];
    }
  }
}

export async function getProductBySlug(rawSlug: string): Promise<Product | null> {
  if (!rawSlug) return null;

  const decoded = decodeURIComponent(rawSlug).trim();
  const clean = slugify(decoded);

  // 1. Direct query with cleanSlug AND status == "published"
  const candidateSlugs = Array.from(new Set([clean, decoded, rawSlug])).filter(Boolean);

  for (const s of candidateSlugs) {
    try {
      const q = query(
        collection(db, "products"),
        where("slug", "==", s),
        where("status", "==", "published"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        return { id: docData.id, ...(docData.data() as Omit<Product, "id">) };
      }
    } catch {
      // Continue to next check
    }

    try {
      const qAny = query(
        collection(db, "products"),
        where("slug", "==", s),
        limit(1)
      );
      const snapshot = await getDocs(qAny);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        return { id: docData.id, ...(docData.data() as Omit<Product, "id">) };
      }
    } catch {
      // Continue
    }
  }

  // 2. Direct document ID lookup
  for (const s of candidateSlugs) {
    try {
      const docRef = doc(db, "products", s);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Product, "id">) };
      }
    } catch {
      // Continue
    }
  }

  // 3. Fallback: Retrieve all published products and find in memory
  // This guarantees finding the product regardless of encoding, casing, or index quirks
  try {
    const all = await getProducts();
    const found = all.find((p) => {
      const pSlug = p.slug?.trim() || "";
      const pSlugified = slugify(pSlug);
      const pNameSlug = slugify(p.name || "");
      return (
        p.id === decoded ||
        p.id === rawSlug ||
        pSlug === decoded ||
        pSlug === clean ||
        pSlug.toLowerCase() === clean ||
        pSlugified === clean ||
        pNameSlug === clean
      );
    });
    if (found) {
      return found;
    }
  } catch (error) {
    console.error("Fallback search failed in getProductBySlug:", error);
  }

  return null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Omit<Product, "id">) };
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
  }
  return null;
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const colRef = collection(db, "products");
  const newDocRef = doc(colRef);
  const now = Date.now();
  const cleanSlug = slugify(data.slug || data.name) || newDocRef.id;
  const product: Product = {
    ...data,
    slug: cleanSlug,
    status: data.status || "published",
    id: newDocRef.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(newDocRef, product);
  return newDocRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  const docRef = doc(db, "products", id);
  const updateData: Partial<Product> = { ...data, updatedAt: Date.now() };
  if (data.slug) {
    updateData.slug = slugify(data.slug);
  }
  await updateDoc(docRef, updateData);
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

// ---------------- Categories ----------------

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Category, "id">),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, "id">),
      }));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list;
    } catch {
      return [];
    }
  }
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<string> {
  const colRef = collection(db, "categories");
  const newDocRef = doc(colRef);
  const category: Category = {
    ...data,
    id: newDocRef.id,
  };
  await setDoc(newDocRef, category);
  return newDocRef.id;
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<void> {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
}

// ---------------- Orders ----------------

export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "orderNumber">
): Promise<Order> {
  const colRef = collection(db, "orders");
  const newDocRef = doc(colRef);
  const now = Date.now();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `YD-${now.toString().slice(-4)}-${rand}`;

  const order: Order = {
    ...data,
    id: newDocRef.id,
    orderNumber,
    createdAt: now,
  };

  await setDoc(newDocRef, order);
  return order;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Order, "id">),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, "id">),
      }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return list;
    } catch {
      return [];
    }
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Omit<Order, "id">) };
    }
  } catch (error) {
    console.error("Error fetching order by id:", error);
  }
  return null;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, { status });
}
