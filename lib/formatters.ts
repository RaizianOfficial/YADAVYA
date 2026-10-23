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
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
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
