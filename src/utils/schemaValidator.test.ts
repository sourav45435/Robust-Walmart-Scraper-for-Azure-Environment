import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isWalmartPrivateLabel,
  hasApproximateWeight,
  validateRecordKeysAndOrder,
  MANDATORY_FIELD_ORDER,
} from './schemaValidator.ts';

test('isWalmartPrivateLabel detects Walmart private brands accurately', () => {
  assert.equal(isWalmartPrivateLabel('Great Value Whole Milk 1 Gallon'), true);
  assert.equal(isWalmartPrivateLabel('Equate Ibuprofen Tablets 200mg'), true);
  assert.equal(isWalmartPrivateLabel("Parent's Choice Gentle Baby Formula"), true);
  assert.equal(isWalmartPrivateLabel('Mainstays Non-Stick Cookie Sheet'), true);
  assert.equal(isWalmartPrivateLabel('Pen+Gear 1-Subject Notebook'), true);
  assert.equal(isWalmartPrivateLabel('Marketside Fresh Organic Strawberries'), true);

  // Non-private labels
  assert.equal(isWalmartPrivateLabel('Coca-Cola 12 Pack 12oz Cans'), false);
  assert.equal(isWalmartPrivateLabel('Tide PODS Laundry Detergent'), false);
  assert.equal(isWalmartPrivateLabel('Colgate Total Whitening Toothpaste'), false);
  assert.equal(isWalmartPrivateLabel('Pampers Swaddlers Size 3'), false);
});

test('hasApproximateWeight excludes approx and approximately wording', () => {
  assert.equal(hasApproximateWeight('16 oz'), false);
  assert.equal(hasApproximateWeight('1.5 lb'), false);
  assert.equal(hasApproximateWeight('approx 2.5 lb'), true);
  assert.equal(hasApproximateWeight('approximately 1.8 lbs'), true);
  assert.equal(hasApproximateWeight('Approx. 500g'), true);
  assert.equal(hasApproximateWeight(''), false);
});

test('validateRecordKeysAndOrder verifies strict 22-field sequence', () => {
  // Construct a valid record matching MANDATORY_FIELD_ORDER
  const validRecord: Record<string, string> = {
    zipcode: '67207',
    store_name: 'Walmart Supercenter #3170',
    store_location: '7701 E Kellogg Dr, Wichita, KS',
    store_logo: 'https://i5.walmartimages.com/dfw/63fd9f59-b3e1/k2-_873e3164-9b24-4f05-8854-c8c36203cf36.v1.png',
    store_brand: 'yes',
    category: 'Food',
    sub_category: 'Dairy & Eggs',
    product_title: 'Great Value Whole Vitamin D Milk, 1 Gallon',
    weight: '1 gal',
    regular_price: '3.48',
    sale_price: '',
    volume_deals_description: '',
    volume_deals_price: '',
    digital_deals_description: '',
    digital_deals_price: '',
    image_url: 'https://i5.walmartimages.com/asr/milk_example.jpeg',
    url: 'https://www.walmart.com/ip/Great-Value-Whole-Milk-1-Gallon/10450114',
    upc: '078742351865',
    gupc: '',
    ppm: '$3.48/gal',
    unit_price: '',
    crawl_date: '2026-10-17',
  };

  const res = validateRecordKeysAndOrder(validRecord);
  assert.equal(res.valid, true, `Expected valid but got errors: ${res.errors.join(', ')}`);

  // Invalid: missing field
  const invalidMissing = { ...validRecord };
  delete (invalidMissing as Record<string, string>).zipcode;
  const resMissing = validateRecordKeysAndOrder(invalidMissing);
  assert.equal(resMissing.valid, false);

  // Invalid: out-of-order keys
  const outOfOrder: Record<string, string> = {
    store_name: validRecord.store_name,
    zipcode: validRecord.zipcode, // swapped
    ...validRecord,
  };
  const resOrder = validateRecordKeysAndOrder(outOfOrder);
  assert.equal(resOrder.valid, false);

  // Invalid: gupc not empty
  const invalidGupc = { ...validRecord, gupc: '00078742351865' };
  const resGupc = validateRecordKeysAndOrder(invalidGupc);
  assert.equal(resGupc.valid, false);

  // Invalid: approximate weight
  const invalidWeight = { ...validRecord, weight: 'approx 1 gal' };
  const resWeight = validateRecordKeysAndOrder(invalidWeight);
  assert.equal(resWeight.valid, false);

  // Invalid: null value
  const invalidNull = { ...validRecord, sale_price: null as unknown as string };
  const resNull = validateRecordKeysAndOrder(invalidNull);
  assert.equal(resNull.valid, false);
});
