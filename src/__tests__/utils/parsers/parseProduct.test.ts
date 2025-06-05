import { parseProduct } from '../../../utils/parsers';
import { ProductData } from '../../../models/types/api-types';
import { ProductProjection } from '@commercetools/platform-sdk';

const rawProduct: ProductProjection = {
  id: '1',
  version: 39,
  productType: {
    typeId: 'product-type',
    id: '1',
  },
  name: {
    'en-US': 'Test name',
  },
  description: {
    'en-US': 'Test description',
  },
  categories: [
    {
      typeId: 'category',
      id: '1',
    },
  ],
  categoryOrderHints: {},
  slug: {
    'en-US': 'Test slug',
  },
  masterVariant: {
    id: 1,
    sku: 'sku-0010',
    key: 'variant-0010',
    prices: [
      {
        id: '1',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 3500,
          fractionDigits: 2,
        },
        key: 'price-usd',
        country: 'US',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 3150,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: '1',
          },
        },
      },
      {
        id: '1',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4500,
          fractionDigits: 2,
        },
        key: 'price-sale',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 4050,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: '1',
          },
        },
      },
    ],
    images: [
      {
        url: 'http://example.com/image.jpg',
        dimensions: {
          w: 800,
          h: 800,
        },
      },
      {
        url: 'http://example.com/image1.jpg',
        dimensions: {
          w: 800,
          h: 800,
        },
      },
    ],
    attributes: [
      {
        name: 'title',
        value: {
          'en-US': 'Test title',
        },
      },
      {
        name: 'eco-class',
        value: {
          key: 'A',
          label: {
            'en-US': 'high',
          },
        },
      },
      {
        name: 'description',
        value: {
          'en-US': 'Test description',
        },
      },
      {
        name: 'color',
        value: 'black',
      },
    ],
    assets: [],
  },
  variants: [],
  createdAt: '2025-05-23T22:33:04.468Z',
  lastModifiedAt: '2025-05-28T21:51:35.011Z',
};

describe('parseProduct', () => {
  it('should parse a product correctly', () => {
    const expected: ProductData = {
      id: '1',
      title: 'Test name',
      description: 'Test description',
      price: 35,
      discountPrice: 31.5,
      currency: '$',
      image: 'http://example.com/image.jpg',
      images: ['http://example.com/image.jpg', 'http://example.com/image1.jpg'],
      sku: 'sku-0010',
      attributes: [
        {
          name: 'title',
          value: {
            'en-US': 'Test title',
          },
        },
        {
          name: 'eco-class',
          value: {
            key: 'A',
            label: {
              'en-US': 'high',
            },
          },
        },
        {
          name: 'description',
          value: {
            'en-US': 'Test description',
          },
        },
        {
          name: 'color',
          value: 'black',
        },
      ],
    };

    const result = parseProduct([rawProduct]);
    expect(result[0]).toEqual(expected);
  });
});
