export type Shop = {
  id: string;
  name: string;
  sortOrder: number;
};

export type Business = {
  id: string;
  name: string;
  ownerName: string;
};

export type Bale = {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  purchasedAt: string;
  purchasePrice: number;
  pieces: number;
  notes: string;
  photo: string | null;
  recorded: number;
  sold: number;
  available: number;
};

export type Cloth = {
  id: string;
  baleId: string | null;
  baleName: string | null;
  shopId: string;
  shopName: string;
  category: string;
  description: string;
  size: string;
  color: string;
  sellingPrice: number;
  cost: number;
  status: "available" | "sold";
  photo: string | null;
  createdAt: string;
  soldAt: string | null;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  notes: string;
  purchases: number;
  paid: number;
  outstanding: number;
};

export type SaleRow = {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  clothingId: string;
  item: string;
  photo: string | null;
  sellingPrice: number;
  soldAt: string;
  notes: string;
};

export type PaymentRow = {
  id: string;
  customerId: string;
  amount: number;
  paidAt: string;
  notes: string;
};

export type ExpenseRow = {
  id: string;
  shopId: string | null;
  shopName: string | null;
  category: string;
  amount: number;
  spentAt: string;
  notes: string;
};

export type OwingCustomer = {
  id: string;
  name: string;
  outstanding: number;
};

export type ShopStats = {
  id: string;
  name: string;
  sales: number;
  expenses: number;
  profit: number;
};

export type DashboardData = {
  business: Business;
  shops: Shop[];
  greetingName: string;
  todaySales: number;
  todayCollected: number;
  todayExpenses: number;
  todayCogs: number;
  todayProfit: number;
  outstanding: number;
  clothesAvailable: number;
  owing: OwingCustomer[];
  shopStats: ShopStats[];
  recentSales: SaleRow[];
};

export type ReportPeriod = "daily" | "weekly" | "monthly";

export type ReportData = {
  period: ReportPeriod;
  from: string;
  to: string;
  sales: number;
  collected: number;
  expenses: number;
  cogs: number;
  profit: number;
  itemsSold: number;
  outstanding: number;
  categories: { category: string; count: number; sales: number }[];
  byDay: { day: string; sales: number; expenses: number }[];
  shopStats: ShopStats[];
};
