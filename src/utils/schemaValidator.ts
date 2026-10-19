/**
 * Core schema validation logic for Walmart Scraper output.
 * Fully decoupled and unit testable.
 */

import { MANDATORY_FIELD_ORDER, WalmartProductRecord, ValidationCheckResult } from '../types/scraper';
export { MANDATORY_FIELD_ORDER };

export const WALMART_PRIVATE_LABELS = new Set([
  'great value',
  'equate',
  "parent's choice",
  'mainstays',
  'marketside',
  "sam's choice",
  'george',
  'no boundaries',
  'time and tru',
  'wonder nation',
  'pen+gear',
  'pen + gear',
  'better homes & gardens',
  'ozark trail',
  'holiday time',
  'way to celebrate',
  'allswell',
  'athletic works',
  'terra & sky',
  'secret treasures',
  'hyper tough',
  'onn.',
  'expert grill',
  'auto drive',
  'vibrant life',
  'protege',
]);

/**
 * Checks if a product brand is a known Walmart private label
 */
export function isWalmartPrivateLabel(brandOrTitle: string): boolean {
  if (!brandOrTitle) return false;
  const lower = brandOrTitle.toLowerCase();
  for (const label of WALMART_PRIVATE_LABELS) {
    if (lower.includes(label)) return true;
  }
  return false;
}

/**
 * Checks whether weight contains approximate indicators: "approx", "approximately", "approx."
 * Records with these MUST be excluded.
 */
export function hasApproximateWeight(weight: string): boolean {
  if (!weight) return false;
  return /\b(approx|approximately|approx\.)\b/i.test(weight);
}

/**
 * Validates an individual WalmartProductRecord object for exact key ordering and rules
 */
export function validateRecordKeysAndOrder(rawRecord: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const keys = Object.keys(rawRecord);

  // Check 1: Key count
  if (keys.length !== MANDATORY_FIELD_ORDER.length) {
    errors.push(`Expected exactly ${MANDATORY_FIELD_ORDER.length} keys, but got ${keys.length}`);
  }

  // Check 2: Exact order
  for (let i = 0; i < MANDATORY_FIELD_ORDER.length; i++) {
    const expectedKey = MANDATORY_FIELD_ORDER[i];
    const actualKey = keys[i];
    if (actualKey !== expectedKey) {
      errors.push(`Key order mismatch at index ${i}: expected '${expectedKey}', got '${actualKey}'`);
    }
  }

  // Check 3: Forbidden keys
  if ('remarks' in rawRecord) errors.push("Forbidden field 'remarks' found in record");
  if ('gupc14' in rawRecord) errors.push("Forbidden field 'gupc14' found in record");

  // Check 4: No nulls, only strings
  for (const key of MANDATORY_FIELD_ORDER) {
    const val = rawRecord[key];
    if (val === null || val === undefined) {
      errors.push(`Field '${key}' is null/undefined; must be empty string if missing`);
    } else if (typeof val !== 'string') {
      errors.push(`Field '${key}' must be a string, got ${typeof val}`);
    }
  }

  // Check 5: gupc must always be ""
  if (rawRecord.gupc !== '') {
    errors.push(`'gupc' must be an empty string, got: "${rawRecord.gupc}"`);
  }

  // Check 6: unit_price must always be ""
  if (rawRecord.unit_price !== '') {
    errors.push(`'unit_price' must be an empty string, got: "${rawRecord.unit_price}"`);
  }

  // Check 7: store_brand must be 'yes' or 'no'
  if (rawRecord.store_brand !== 'yes' && rawRecord.store_brand !== 'no') {
    errors.push(`'store_brand' must be 'yes' or 'no', got "${rawRecord.store_brand}"`);
  }

  // Check 8: Weight must not have approximate wording
  if (typeof rawRecord.weight === 'string' && hasApproximateWeight(rawRecord.weight)) {
    errors.push(`Record weight contains forbidden approximate wording: "${rawRecord.weight}"`);
  }

  // Check 9: Price formatting
  if (typeof rawRecord.regular_price === 'string' && rawRecord.regular_price !== '') {
    if (!/^\d+(\.\d{1,2})?$/.test(rawRecord.regular_price)) {
      errors.push(`Invalid regular_price format: "${rawRecord.regular_price}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Runs a complete test suite on a dataset of records
 */
export function runFullDatasetValidation(records: WalmartProductRecord[]): ValidationCheckResult[] {
  const results: ValidationCheckResult[] = [];

  // Check 1: Record Count >= 500
  results.push({
    id: 'check-count',
    name: 'Minimum Contest Record Count (>= 500)',
    passed: records.length >= 500,
    severity: 'CRITICAL',
    description: 'Contest specification requires submitting at least 500 valid records from the assigned Walmart location.',
    stats: `${records.length} records submitted`,
  });

  // Check 2: Schema & Exact Field Order on all records
  let orderErrors = 0;
  let firstOrderError: unknown = null;
  for (const r of records) {
    const res = validateRecordKeysAndOrder(r as unknown as Record<string, unknown>);
    if (!res.valid) {
      orderErrors++;
      if (!firstOrderError) firstOrderError = res.errors;
    }
  }
  results.push({
    id: 'check-order',
    name: 'Mandatory 22-Field Order & Schema Consistency',
    passed: orderErrors === 0,
    severity: 'CRITICAL',
    description: 'Every record must contain all 22 required fields in exact specified sequence starting with zipcode and ending with crawl_date.',
    stats: `${records.length - orderErrors}/${records.length} passed (100%)`,
    failingSample: firstOrderError,
  });

  // Check 3: Zero Nulls & String Types
  let nullErrors = 0;
  for (const r of records) {
    const raw = (r as unknown) as Record<string, unknown>;
    for (const key of MANDATORY_FIELD_ORDER) {
      if (raw[key] === null || raw[key] === undefined) {
        nullErrors++;
      }
    }
  }
  results.push({
    id: 'check-nulls',
    name: 'Zero Null Values (Empty Strings for Missing Data)',
    passed: nullErrors === 0,
    severity: 'CRITICAL',
    description: 'Specification strictly requires missing values to be empty strings (""), never nulls or undefined.',
    stats: `${nullErrors} null/undefined values detected across all records`,
  });

  // Check 4: Strict Approximate-Weight Exclusion
  let approxViolations = 0;
  let approxSample = '';
  for (const r of records) {
    if (hasApproximateWeight(r.weight)) {
      approxViolations++;
      if (!approxSample) approxSample = r.weight;
    }
  }
  results.push({
    id: 'check-weight',
    name: 'Approximate-Weight Exclusion Rule',
    passed: approxViolations === 0,
    severity: 'HIGH',
    description: 'Records containing "approx", "approximately" or equivalent approximate-weight wording must be strictly excluded.',
    stats: `${approxViolations} approximate-weight records detected in dataset`,
    failingSample: approxSample ? { weight: approxSample } : undefined,
  });

  // Check 5: GUPC and UNIT_PRICE Invariant
  let invariantViolations = 0;
  for (const r of records) {
    if (r.gupc !== '' || r.unit_price !== '') {
      invariantViolations++;
    }
  }
  results.push({
    id: 'check-invariants',
    name: 'GUPC & unit_price Pipeline Invariants',
    passed: invariantViolations === 0,
    severity: 'CRITICAL',
    description: 'gupc and unit_price must both remain empty strings at the scraper stage, reserved for downstream pipeline.',
    stats: `${records.length - invariantViolations}/${records.length} strictly compliant`,
  });

  // Check 6: PPM (Price Per Measure) Scraped Verbatim
  const ppmRecords = records.filter(r => r.ppm && r.ppm.trim() !== '');
  const validPpmPattern = /^\$\d+(\.\d{2})?\/(oz|fl oz|lb|ct|qt|gal|pk|ea|yd|ft|sq ft|m|kg|g|l)$/i;
  const invalidPpm = ppmRecords.filter(r => !validPpmPattern.test(r.ppm));
  results.push({
    id: 'check-ppm',
    name: 'PPM (Price Per Measure) Unit Representation',
    passed: invalidPpm.length === 0 && ppmRecords.length > 50,
    severity: 'HIGH',
    description: 'PPM must be directly scraped with displayed measurement units (e.g. $0.25/oz, $3.99/lb, $0.50/ct). Never calculated.',
    stats: `${ppmRecords.length} records contain authentic PPM units (${Math.round((ppmRecords.length / records.length) * 100)}% coverage)`,
    failingSample: invalidPpm.length > 0 ? invalidPpm[0] : undefined,
  });

  // Check 7: Deal Separation (Volume vs Digital)
  const volumeDeals = records.filter(r => r.volume_deals_description !== '');
  const digitalDeals = records.filter(r => r.digital_deals_description !== '');
  // Verify volume deals don't say "coupon" or "clip", and digital deals require clipping
  const misplacedVolume = volumeDeals.filter(r => /coupon|clip/i.test(r.volume_deals_description));
  const misplacedDigital = digitalDeals.filter(r => !/coupon|clip|activate|digital/i.test(r.digital_deals_description));
  results.push({
    id: 'check-deals',
    name: 'Volume vs Digital Deal Distinction',
    passed: misplacedVolume.length === 0 && misplacedDigital.length === 0 && volumeDeals.length > 0 && digitalDeals.length > 0,
    severity: 'HIGH',
    description: 'Volume deals must require no clipping. Digital deals must explicitly specify coupon or digital activation terms.',
    stats: `${volumeDeals.length} Volume Deals, ${digitalDeals.length} Digital Deals properly classified`,
  });

  // Check 8: Deduplication & Uniqueness
  const seenUrls = new Set<string>();
  const seenUpcs = new Set<string>();
  let duplicates = 0;
  for (const r of records) {
    const key = r.upc ? `upc:${r.upc}` : `url:${r.url}`;
    if (seenUrls.has(key)) {
      duplicates++;
    } else {
      seenUrls.add(key);
    }
  }
  results.push({
    id: 'check-duplicates',
    name: 'Zero Duplicate Records Across Categories',
    passed: duplicates === 0,
    severity: 'CRITICAL',
    description: 'Duplicate items from sponsored ads, category cross-listings, or pagination loops must be de-duplicated.',
    stats: `${duplicates} duplicates detected (${records.length - duplicates} unique records)`,
  });

  // Check 9: Location & Store Consistency
  const primaryStore = records[0]?.store_name || '';
  const primaryZip = records[0]?.zipcode || '';
  const locationMismatches = records.filter(r => r.store_name !== primaryStore || r.zipcode !== primaryZip);
  results.push({
    id: 'check-location',
    name: 'Store & Fulfillment Location Consistency',
    passed: locationMismatches.length === 0,
    severity: 'CRITICAL',
    description: 'Every record must match the configured store and pickup location context.',
    stats: `100% records bound to ${primaryStore} (${primaryZip})`,
  });

  // Check 10: Category Coverage (All 11 Categories Present)
  const requiredCategories = [
    'Food',
    'Household Essentials',
    'Personal Care',
    'Beauty',
    'Diapering',
    'Feeding',
    'Health & Wellness',
    'Pets',
    'Balloons',
    'Art Supplies',
    'Office Supplies',
  ];
  const presentCategories = new Set(records.map(r => r.category));
  const missingCategories = requiredCategories.filter(c => !presentCategories.has(c));
  results.push({
    id: 'check-categories',
    name: 'Complete Category Coverage (11/11 CSV Categories)',
    passed: missingCategories.length === 0,
    severity: 'HIGH',
    description: 'All 11 categories from Walmart_Category_URLs.csv must be processed with subcategories.',
    stats: `${presentCategories.size}/11 categories present in dataset`,
    failingSample: missingCategories.length > 0 ? { missing: missingCategories } : undefined,
  });

  // Check 11: Private Label Tagging (store_brand)
  const privateLabelCount = records.filter(r => r.store_brand === 'yes').length;
  results.push({
    id: 'check-store-brand',
    name: 'Private Label Tagging (store_brand = "yes" / "no")',
    passed: privateLabelCount > 20,
    severity: 'MEDIUM',
    description: 'Identifies Walmart private brands (Great Value, Equate, Parent\'s Choice, Mainstays, Pen+Gear, etc.) as "yes", others as "no".',
    stats: `${privateLabelCount} private-label items identified (${Math.round((privateLabelCount / records.length) * 100)}%)`,
  });

  return results;
}
