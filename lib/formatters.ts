/**
 * Format currency in Indian Rupee format (e.g. ₹1,499)
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate URL-friendly slug from a string
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "") // Remove quotes
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Format timestamp into readable date
 */
export function formatDate(timestamp: number | string): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Generate a clean order reference number
 */
export function generateOrderNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const time = Date.now().toString().slice(-4);
  return `YD-${time}-${rand}`;
}

/**
 * Normalizes user-provided image URLs:
 * - Trims whitespaces, newlines, and surrounding quotes
 * - Prepends https:// if protocol is missing
 * - Converts Google Drive share/view links into direct image URLs
 * - Converts Dropbox links to direct download/renderable image URLs (raw=1)
 * - Converts Imgur page links to direct image URLs
 */
export function normalizeImageUrl(rawUrl?: string | null): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // Strip wrapping single or double quotes
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }

  if (!url) return "";

  // Auto-prepend https if protocol-relative (//example.com/img.jpg)
  if (url.startsWith("//")) {
    url = "https:" + url;
  } else if (!/^https?:\/\//i.test(url) && !url.startsWith("data:")) {
    // If it starts without http(s):// but contains a domain
    if (url.includes(".")) {
      url = "https://" + url;
    }
  }

  // Google Drive share link -> direct viewable file URL
  // e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // or https://drive.google.com/open?id=FILE_ID
  // or https://drive.google.com/uc?id=FILE_ID
  const gDriveMatch = url.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=)([a-zA-Z0-9_-]+)/
  );
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  // Dropbox link -> raw=1
  if (url.includes("dropbox.com")) {
    url = url.replace(/[?&]dl=0/, "").replace(/[?&]dl=1/, "");
    url += (url.includes("?") ? "&" : "?") + "raw=1";
    return url;
  }

  // Imgur page link -> direct image
  // e.g. https://imgur.com/abc1234 -> https://i.imgur.com/abc1234.jpg
  const imgurMatch = url.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch && imgurMatch[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  return url;
}

