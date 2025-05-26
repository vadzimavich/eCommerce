import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductData } from '../models/types/api-types';

export function parseProduct(rawProduct: ProductProjection): ProductData {
  const titleAttribute = rawProduct.masterVariant.attributes?.find((attribute) => attribute.name === 'title');
  const title = titleAttribute?.value?.['en-US'] || 'No title';

  const description = rawProduct.description?.['en-US'] || 'No description';

  const priceCents = rawProduct.masterVariant.prices?.[0]?.value?.centAmount;
  const discountCents = rawProduct.masterVariant.prices?.[0]?.discounted?.value.centAmount;
  const price = priceCents ? priceCents / 100 : undefined;
  const discountPrice = discountCents ? discountCents / 100 : undefined;

  const image = rawProduct.masterVariant.images?.[0]?.url;

  return {
    id: rawProduct.id,
    title,
    description,
    price,
    discountPrice,
    image,
    sku: rawProduct.masterVariant.sku,
  };
}
