/**
 * @jest-environment jsdom
 */

import { parserFilters } from '../../../utils/parsers';

describe('parserFilters', () => {
  test('should process priceMin', () => {
    const result = parserFilters({ priceMin: 1 });

    expect(result).toEqual([`variants.price.centAmount:range(100 to *)`]);
  });

  test('should process priceMax', () => {
    const result = parserFilters({ priceMax: 1 });

    expect(result).toEqual([`variants.price.centAmount:range(0 to 100)`]);
  });

  test('should process categoryId', () => {
    const result = parserFilters({ categoryId: '1' });

    expect(result).toEqual([`categories.id:"1"`]);
  });

  test('should process any key', () => {
    const result = parserFilters({ test: '1' });

    expect(result).toEqual([`variants.attributes.test.key:"1"`]);
  });

  test('should process discount-price', () => {
    const result = parserFilters({ ['discount-price']: true });

    expect(result).toEqual([`variants.attributes.discount-price:"true"`]);
  });

  test('should process bestsaller', () => {
    const result = parserFilters({ bestsaller: true });

    expect(result).toEqual([`variants.attributes.bestsaller:"true"`]);
  });
});
