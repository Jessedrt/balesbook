export const CLOTHING_CATEGORIES = [
  "Women's gown",
  "Women's top",
  "Women's skirt",
  "Men's shirt",
  "Men's trousers",
  "Jeans",
  "Jacket",
  "Kids",
  "Ankara / wrapper",
  "Shoes",
  "Bag",
  "Other",
] as const;

export const SIZES = [
  "Free",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
] as const;

export const COLORS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Brown",
  "Pink",
  "Grey",
  "Ankara",
  "Multi",
] as const;

export const EXPENSE_CATEGORIES = [
  "Transport",
  "Shop rent",
  "Packaging",
  "Staff",
  "Repairs",
  "Light / power",
  "Other",
] as const;

export const COLOR_SWATCH: Record<string, string> = {
  Black: "#1C1712",
  White: "#F7F1E4",
  Blue: "#2F4F7A",
  Red: "#9A3B30",
  Green: "#1E5843",
  Yellow: "#C4A35A",
  Brown: "#6B4423",
  Pink: "#C98990",
  Grey: "#7A746A",
  Ankara: "#1E5843",
  Multi: "#6F675C",
};

export type ClothingCategory = (typeof CLOTHING_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
