import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTION_DATASET, buildProductionDataset } from './productionDataset.ts';
import { runFullDatasetValidation, validateRecordKeysAndOrder } from '../utils/schemaValidator.ts';
import { CONFIGURED_STORES } from './categoryUrls.ts';

test('PRODUCTION_DATASET has >= 500 records', () => {
  assert.ok(PRODUCTION_DATASET.length >= 500, `Expected >= 500 records, got ${PRODUCTION_DATASET.length}`);
});

test('PRODUCTION_DATASET passes all 11 validation checks without failure', () => {
  const results = runFullDatasetValidation(PRODUCTION_DATASET);
  const failures = results.filter(r => !r.passed);
  assert.equal(
    failures.length,
    0,
    `Validation failed with ${failures.length} errors: ${failures.map(f => `${f.name}: ${f.stats}`).join('; ')}`
  );
});

test('Every single record in PRODUCTION_DATASET strictly complies with 22-field order and no nulls', () => {
  for (let i = 0; i < PRODUCTION_DATASET.length; i++) {
    const record = PRODUCTION_DATASET[i];
    const validation = validateRecordKeysAndOrder(record as unknown as Record<string, unknown>);
    assert.equal(
      validation.valid,
      true,
      `Record ${i} (${record.product_title}) failed: ${validation.errors.join(', ')}`
    );
  }
});

test('All 11 categories from Walmart_Category_URLs.csv are present with >20 records each', () => {
  const catCounts: Record<string, number> = {};
  for (const r of PRODUCTION_DATASET) {
    catCounts[r.category] = (catCounts[r.category] || 0) + 1;
  }

  const expectedCategories = [
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

  for (const cat of expectedCategories) {
    assert.ok(
      catCounts[cat] && catCounts[cat] > 20,
      `Category ${cat} should have > 20 records, got ${catCounts[cat] || 0}`
    );
  }
});

test('buildProductionDataset allows switching store without modifying scraper schema', () => {
  const bentonvilleStore = CONFIGURED_STORES[1]; // Store #100
  const dataset = buildProductionDataset(bentonvilleStore, '2026-10-18');
  assert.equal(dataset[0].store_name, 'Walmart Supercenter #100');
  assert.equal(dataset[0].zipcode, '72712');
  assert.equal(dataset[0].crawl_date, '2026-10-18');
  assert.equal(dataset.length >= 500, true);
});
