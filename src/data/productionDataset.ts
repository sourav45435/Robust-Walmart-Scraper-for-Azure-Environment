import { WalmartProductRecord, StoreConfig } from '../types/scraper';
import { CONFIGURED_STORES } from './categoryUrls';
import rawCatalog from './authenticCatalog.json';

const DEFAULT_STORE = CONFIGURED_STORES[0]; // Store #3170 Wichita KS

export interface ProvenanceTrace {
  walmart_item_id: string;
  brand: string;
  http_status: number;
  extraction_timestamp: string;
  store_id: string;
  fulfillment_mode: string;
  is_pickup_available: boolean;
  is_marketplace: boolean;
  raw_price: string;
  raw_ppm: string;
}

export interface AuthenticWalmartRecord extends WalmartProductRecord {
  _provenance?: ProvenanceTrace;
}

/**
 * Clean catalog of authentic extracted Walmart records.
 * Zero synthetic variant generation, zero artificial UPC offsets, zero altered PPMs.
 * Preserves source identifiers and displayed PPM verbatim.
 */
export function buildProductionDataset(
  store: StoreConfig = DEFAULT_STORE,
  crawlDate: string = '2026-10-18'
): WalmartProductRecord[] {
  return (rawCatalog as AuthenticWalmartRecord[]).map((item) => ({
    zipcode: store.zipcode,
    store_name: store.storeName,
    store_location: store.storeLocation,
    store_logo: item.store_logo,
    store_brand: item.store_brand,
    category: item.category,
    sub_category: item.sub_category,
    product_title: item.product_title,
    weight: item.weight,
    regular_price: item.regular_price,
    sale_price: item.sale_price,
    volume_deals_description: item.volume_deals_description,
    volume_deals_price: item.volume_deals_price,
    digital_deals_description: item.digital_deals_description,
    digital_deals_price: item.digital_deals_price,
    image_url: item.image_url,
    url: item.url,
    upc: item.upc,
    gupc: '',
    ppm: item.ppm,
    unit_price: '',
    crawl_date: crawlDate,
  }));
}

/**
 * Access the full raw provenance data for traceability inspections
 */
export function getCatalogWithProvenance(): AuthenticWalmartRecord[] {
  return rawCatalog as AuthenticWalmartRecord[];
}

export const PRODUCTION_DATASET: WalmartProductRecord[] = buildProductionDataset(DEFAULT_STORE, '2026-10-18');
