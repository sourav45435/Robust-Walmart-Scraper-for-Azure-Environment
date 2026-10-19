export interface ExtractedCatalogItem {
  category: string;
  sub_category: string;
  product_title: string;
  brand: string;
  is_store_brand: 'yes' | 'no';
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
  ppm: string;
  walmart_item_id: string;
  source_response?: {
    http_status: number;
    extraction_timestamp: string;
    store_id: string;
    fulfillment_type: string;
    is_pickup_available: boolean;
    raw_price_string: string;
    raw_unit_price_string: string;
  };
}
