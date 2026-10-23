import React from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

// Clean custom SVG for Instagram with matching Lucide stroke style
function InstagramIcon({
  size = 18,
  strokeWidth = 1.25,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export const iconMap = {
  search: Search,
  bag: ShoppingBag,
  menu: Menu,
  close: X,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  plus: Plus,
  minus: Minus,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  check: Check,
  trash: Trash2,
  pencil: Pencil,
  eye: Eye,
  eyeOff: EyeOff,
  grip: GripVertical,
  instagram: InstagramIcon as unknown as LucideIcon,
  externalLink: ExternalLink,
  filter: SlidersHorizontal,
  reset: RotateCcw,
  packageCheck: PackageCheck,
  truck: Truck,
};

export type IconName = keyof typeof iconMap;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.25,
  className = "",
  ...props
}: IconProps) {
  const Component = iconMap[name];
  if (!Component) return null;

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={`shrink-0 text-current ${className}`}
      {...props}
    />
  );
}
