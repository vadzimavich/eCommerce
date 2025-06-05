/**
 * @jest-environment jsdom
 */

import { parserCategories } from '../../../utils/parsers';

describe('parserCategories', () => {
  const data = {
    id: 'id',
    name: {
      ['en-US']: 'name',
    },
    version: 1,
    createdAt: '',
    lastModifiedAt: '',
    slug: {
      ['en-US']: 'name',
    },
    ancestors: [],
    orderHint: '',
  };

  test('should return array categories', () => {
    const result = parserCategories([data]);

    expect(result).toEqual([{ id: 'id', name: 'name' }]);
  });
});
