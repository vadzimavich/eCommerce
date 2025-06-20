/**
 * @jest-environment jsdom
 */

import { ProductData } from '../../models/types/api-types';
import { ProductCard } from '../../utils/product-card';

// eslint-disable-next-line max-lines-per-function
describe('ProductCard', () => {
  const baseProduct: ProductData = {
    id: '1',
    title: 'Test Product',
    description: 'Test description',
    price: 100,
    discountPrice: 80,
    image: 'http://example.com/image.jpg',
    attributes: [],
  };

  it('should create a product card element with correct structure', () => {
    const card = new ProductCard(baseProduct);
    const element = card.create();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('product-card')).toBe(true);
    expect(element.dataset.id).toBe(baseProduct.id);

    const img: HTMLImageElement | null = element.querySelector('.product-card__img');
    expect(img).toBeInstanceOf(HTMLImageElement);
    expect(img).toBeTruthy();
    expect(img?.src).toBe(baseProduct.image);
    expect(img?.alt).toBe(baseProduct.title);

    const title = element.querySelector('.product-card__title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe(baseProduct.title);

    const description = element.querySelector('.product-card__description');
    expect(description).toBeTruthy();
    expect(description?.textContent).toBe(baseProduct.description);

    const priceContainer = element.querySelector('.product-card__priceinform-price');
    expect(priceContainer).toBeTruthy();

    const oldPrice = priceContainer?.querySelector('.price-old');
    const newPrice = priceContainer?.querySelector('.price-new');
    expect(oldPrice?.textContent).toBe(baseProduct.price !== undefined ? `$${baseProduct.price.toFixed(2)}` : '');
    expect(newPrice?.textContent).toBe(
      baseProduct.discountPrice !== undefined ? `$${baseProduct.discountPrice.toFixed(2)}` : ''
    );

    const button: HTMLButtonElement | null = element.querySelector('button.product-card__priceinform-btn');
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('+');
    expect(button?.dataset.title).toBe('Add To Cart');

    const bestsallerBadge = element.querySelector('.product-card__bestsaller');
    expect(bestsallerBadge).toBeNull();
  });

  it('should add bestsaller badge if attribute is set', () => {
    const productWithBestsaller: ProductData = {
      ...baseProduct,
      attributes: [{ name: 'bestsaller', value: true }],
    };
    const card = new ProductCard(productWithBestsaller);
    const element = card.create();

    const bestsallerBadge = element.querySelector('.product-card__bestsaller');
    expect(bestsallerBadge).toBeTruthy();

    const icon: HTMLImageElement | null = bestsallerBadge?.querySelector('.product-card__bestsaller-img') ?? null;
    expect(icon).toBeTruthy();
    expect(icon?.src).toContain('catalog-bestsaller.png');
    expect(icon?.alt).toBe('icon-bestsaller');
  });

  it('should create image with empty src if no image provided', () => {
    const productNoImage: ProductData = {
      ...baseProduct,
      image: undefined,
    };
    const card = new ProductCard(productNoImage);
    const element = card.create();

    const img: HTMLImageElement | null = element.querySelector('.product-card__img');
    expect(img).toBeTruthy();
    expect(img?.src).toBe('');
    expect(img?.alt).toBe(productNoImage.title);
  });

  it('should render only regular price if no discountPrice', () => {
    const productNoDiscount: ProductData = {
      ...baseProduct,
      discountPrice: undefined,
    };
    const card = new ProductCard(productNoDiscount);
    const element = card.create();

    const priceContainer = element.querySelector('.product-card__priceinform-price');
    const oldPrice = priceContainer?.querySelector('.price-old');
    const newPrice = priceContainer?.querySelector('.price-new');
    const regularPrice = priceContainer?.querySelector('.price-regular');

    expect(oldPrice).toBeNull();
    expect(newPrice).toBeNull();
    if (productNoDiscount.price !== undefined) {
      expect(regularPrice?.textContent).toBe(`$${productNoDiscount.price.toFixed(2)}`);
    } else {
      expect(regularPrice?.textContent).toBe('');
    }
  });
});
