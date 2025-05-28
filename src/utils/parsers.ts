import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductData } from '../models/types/api-types';

export function parseProduct(rawProduct: ProductProjection): ProductData {
  console.log('🚀 ~ parseProduct ~ rawProduct:', rawProduct);
  const title = rawProduct.name?.['en-US'] || 'No title';
  const description = rawProduct.description?.['en-US'] || 'No description';

  const priceCents = rawProduct.masterVariant.prices?.[0]?.value?.centAmount;
  const priceCurrencyCode = rawProduct.masterVariant.prices?.[0]?.value?.currencyCode;
  const currency = priceCurrencyCode === 'USD' ? '$' : undefined;
  const discountCents = rawProduct.masterVariant.prices?.[0]?.discounted?.value.centAmount;
  const price = priceCents ? priceCents / 100 : undefined;
  const discountPrice = discountCents ? discountCents / 100 : undefined;

  const image = rawProduct.masterVariant.images?.[0]?.url;
  const images = rawProduct.masterVariant.images?.map((item) => item.url);

  const attributes = rawProduct.masterVariant.attributes;

  return {
    id: rawProduct.id,
    title,
    description,
    price,
    discountPrice,
    currency,
    image,
    images,
    sku: rawProduct.masterVariant.sku,
    attributes,
  };
}
