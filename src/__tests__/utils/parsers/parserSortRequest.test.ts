/**
 * @jest-environment jsdom
 */

import { parserSortRequest } from '../../../utils/parsers';

describe('parserSortRequest', () => {
  test('should return `price TEST` if sortMethod include price', () => {
    const result = parserSortRequest('price-TEST');

    expect(result).toBe('price TEST');
  });

  test('should return `name.en-US TEST` if sortMethod does not include price', () => {
    const result = parserSortRequest('test-TEST');

    expect(result).toBe('name.en-US TEST');
  });
});
