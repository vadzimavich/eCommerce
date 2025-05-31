import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { CategoryData, ProductData, ProductFilter } from '../models/types/api-types';

export function parseProduct(rawProducts: ProductProjection[]): ProductData[] {
  return rawProducts.map((item) => {
    const priceCents = item.masterVariant.prices?.[0]?.value?.centAmount;
    const discountCents = item.masterVariant.prices?.[0]?.discounted?.value.centAmount;
    const priceCurrencyCode = item.masterVariant.prices?.[0]?.value?.currencyCode;

    return {
      id: item.id,
      title: item.name?.['en-US'] || 'No title',
      description: item.description?.['en-US'] || 'No description',
      price: priceCents ? priceCents / 100 : undefined,
      discountPrice: discountCents ? discountCents / 100 : undefined,
      image: item.masterVariant.images?.[0]?.url,
      images: item.masterVariant.images?.map((img) => img.url),
      sku: item.masterVariant.sku,
      currency: priceCurrencyCode === 'USD' ? '$' : undefined,
      attributes: item.masterVariant.attributes,
    };
  });
}

export function parserSortRequest(sortMethod: string): string {
  const typeSortPrice = 'price';
  const directionSort = sortMethod.slice(sortMethod.indexOf('-') + 1, sortMethod.length);

  return sortMethod.includes(typeSortPrice) ? `price ${directionSort}` : `name.en-US ${directionSort}`;
}

export function parserCategories(categories: Category[]): CategoryData[] {
  return categories.map((item) => ({
    id: item.id,
    name: item.name['en-US'].toString(),
  }));
}

export function parserFilters(filters: ProductFilter): string[] {
  const filterResult: string[] = [];

  let priceMin: number = 0;
  let priceMax: number = 0;

  for (const key in filters) {
    const value = filters[key];

    if (key === 'priceMin') {
      priceMin = +value;
    } else if (key === 'priceMax') {
      priceMax = +value;
    } else if (typeof value === 'string') {
      if (key === 'categoryId') {
        filterResult.push(`categories.id:"${value}"`);
      } else {
        filterResult.push(`variants.attributes.${key}.key:"${value}"`);
      }
    } else if ((key === 'discount-price' || key === 'bestsaller') && typeof value === 'boolean') {
      filterResult.push(`variants.attributes.${key}:"${value}"`);
    }
  }

  if (priceMin > 0 || priceMax > 0) {
    const min = priceMin > 0 ? priceMin * 100 : 0;
    const max = priceMax > 0 ? priceMax * 100 : '*';
    filterResult.push(`variants.price.centAmount:range(${min} to ${max})`);
  }

  return filterResult;
}
