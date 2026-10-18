/**
 * Types for Walmart Scraper Production Suite & Azure Deployment
 */

export interface WalmartProductRecord {
  // Strict 22-field order as required by specification:
  zipcode: string;
  store_name: string;
  store_location: string;
  store_logo: string;
  store_brand: string; // 'yes' or 'no'
  category: string;
  sub_category: string;
  product_title: string;
  weight: string;
  regular_price: string;
  sale_price: string;
  volume_deals_description: string;
  volume_deals_price: string;
  digital_deals_description: string;
  digital_deals_price: string;
  image_url: string;
  url: string;
  upc: string;
  gupc: string; // Must always be ""
  ppm: string; // Price Per Measure as displayed, e.g. "$0.25/oz"
  unit_price: string; // Must always be ""
  crawl_date: string; // Final field e.g. "2026-10-17"
}

export const MANDATORY_FIELD_ORDER: (keyof WalmartProductRecord)[] = [
  'zipcode',
  'store_name',
  'store_location',
  'store_logo',
  'store_brand',
  'category',
  'sub_category',
  'product_title',
  'weight',
  'regular_price',
  'sale_price',
  'volume_deals_description',
  'volume_deals_price',
  'digital_deals_description',
  'digital_deals_price',
  'image_url',
  'url',
  'upc',
  'gupc',
  'ppm',
  'unit_price',
  'crawl_date',
];

export interface StoreConfig {
  storeId: string;
  storeName: string;
  zipcode: string;
  cityState: string;
  storeLocation: string;
  fulfillmentContext: 'PICKUP' | 'IN_STORE';
  address: string;
  phone: string;
}

export interface CategoryConfig {
  name: string;
  url: string;
  scope: string;
  notes: string;
  subcategories: string[];
}

export interface ScraperLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'CHECKPOINT';
  category?: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationCheckResult {
  id: string;
  name: string;
  passed: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  stats: string;
  failingSample?: unknown;
}

export interface FullAuditSummary {
  totalRecords: number;
  uniqueRecords: number;
  duplicateCount: number;
  categoryBreakdown: Record<string, number>;
  ppmCount: number;
  ppmRate: string;
  volumeDealsCount: number;
  digitalDealsCount: number;
  regularProductsCount: number;
  privateLabelCount: number;
  privateLabelRate: string;
  fieldCompleteness: Record<string, string>;
  runtimeSeconds: number;
  executionTimestamp: string;
  storeVerified: boolean;
  storeDetails: StoreConfig;
}
