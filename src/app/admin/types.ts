// Shared TypeScript types for Manufacturing Admin Dashboard

export type ManufacturingStatus =
  | 'pending_qc'
  | 'qc_passed'
  | 'qc_needs_review'
  | 'qc_failed'
  | 'sds_ready'
  | 'ready_to_batch'
  | 'batched'
  | 'labeled'
  | 'shipped'
  | 'delivered';

export interface ManufacturingOrder {
  id: string;
  glaze_name: string;
  color_hex?: string;
  batch_size_g: number;
  status: ManufacturingStatus;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  form?: 'dry' | 'liquid';
  sds_url?: string;
  lot_number?: string;
  tracking_number?: string;
  carrier?: string;
}

export interface RecipeIngredient {
  material_name: string;
  target_weight_g: number;
  category?: 'base' | 'stain' | 'water';
}

export interface RecipeData {
  order_id: string;
  glaze_name: string;
  batch_size_g: number;
  base_ingredients: RecipeIngredient[];
  stain_additions: RecipeIngredient[];
  water: {
    target_weight_g: number;
    notes: string;
  };
  firing_instructions: string;
  lot_number_suggested?: string;
}

export interface BatchData {
  id: string;
  order_id: string;
  lot_number: string;
  staff_initials: string;
  ingredients: BatchIngredient[];
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface BatchIngredient {
  material_name: string;
  target_weight_g: number;
  actual_weight_g: number;
  deviation_percent: number;
}

export type QCCheckStatus = 'pass' | 'warn' | 'fail';

export interface QCCheck {
  check_name: string;
  status: QCCheckStatus;
  value?: number | string;
  threshold?: number | string;
  message: string;
}

export interface QCReport {
  id: string;
  order_id: string;
  overall_status: 'pass' | 'warn' | 'fail';
  checks: QCCheck[];
  failure_reasons: string[];
  created_at: string;
  reviewed_by?: string;
  review_notes?: string;
  reviewed_at?: string;
}

export interface QCPendingItem {
  order_id: string;
  glaze_name: string;
  qc_status: 'pending' | 'pass' | 'warn' | 'fail' | 'needs_review';
  failure_reasons?: string[];
  created_at: string;
  qc_report?: QCReport;
}

export interface LabelData {
  order_id: string;
  glaze_name: string;
  lot_number: string;
  batch_size_g: number;
  created_at: string;
  customer_name: string;
  label_url?: string;
}

export interface ShippingData {
  tracking_number: string;
  carrier: 'USPS' | 'UPS' | 'FedEx' | 'DHL';
  shipped_at?: string;
}

export interface DashboardStats {
  ordersToday: number;
  pendingQC: number;
  readyToBatch: number;
  shippedToday: number;
  totalOrders?: number;
  avgBatchTime?: number;
  qcPassRate?: number;
}

// USB Scale Integration Types
export interface ScaleReading {
  weight_g: number;
  unit: string;
  stable: boolean;
  timestamp?: Date;
}

export interface ScaleDevice {
  id: string;
  name: string;
  vendorId: number;
  productId: number;
  connected: boolean;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
