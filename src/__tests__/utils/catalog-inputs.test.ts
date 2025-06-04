/**
 * @jest-environment jsdom
 */

import {
  createCategorySelect,
  createCheckbox,
  createCheckboxContainer,
  createEcoClassSelect,
  createFilterSection,
  createInputCatalogSearch,
  createInputPriceRange,
  createOptionsSelectCategory,
  createPriceRnageContainer,
  createSelectCatalogSort,
} from '../../utils/catalog-inputs';

// eslint-disable-next-line max-lines-per-function
describe('Catalog inputs', () => {
  const data = {
    id: 'id',
    optoins: ['option1'],
    values: ['value1'],
    categories: null,
    defaultValue: 'defaultValue',
    noData: 'noData',
    title: 'title',
    content: document.createElement('div'),
    classes: ['class'],
  };

  test('createSelectCatalogSort(): should return HTMLSelectElement', () => {
    const result = createSelectCatalogSort(data.id, data.optoins, data.values, data.classes);

    expect(result).toBeInstanceOf(HTMLSelectElement);
    expect(result.id).toBe(data.id);
    data.classes.forEach((item) => {
      expect(result.classList).toContain(item);
    });
    expect(result.querySelector('option')).toBeInstanceOf(HTMLOptionElement);
    expect(result.querySelector('option')?.value).toBe(data.values[0]);
  });

  test('createInputCatalogSearch(): should return HTMLInputElement', () => {
    const result = createInputCatalogSearch(data.id);

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe(data.id);
  });

  test('createFilterSection(): should return HTMLElement', () => {
    const result = createFilterSection(data.title, data.content, data.classes);

    expect(result).toBeInstanceOf(HTMLElement);
    expect(result.querySelector('summary')).toBeInstanceOf(HTMLElement);
    expect(result.querySelector('summary')?.textContent).toBe(data.title);
    data.classes.forEach((item) => {
      expect(result.classList).toContain(item);
    });
  });

  test('createCategorySelect(): should return HTMLSelectElement', () => {
    const result = createCategorySelect(data.id, data.categories, data.defaultValue, data.noData);

    expect(result).toBeInstanceOf(HTMLSelectElement);
    expect(result.id).toBe(data.id);
    expect(result.querySelector('option')?.textContent).toBe(data.defaultValue);
  });

  test('createOptionsSelectCategory(): should add options', () => {
    const select = document.createElement('select');
    createOptionsSelectCategory(select, [{ id: 'id', name: 'name' }]);

    expect(select.querySelector('option')).toBeTruthy();
    expect(select.querySelector('option')?.value).toBe('id');
    expect(select.querySelector('option')?.id).toBe('name');
    expect(select.querySelector('option')?.textContent).toBe('name');
  });

  test('createEcoClassSelect(): should add options', () => {
    const result = createEcoClassSelect(
      data.id,
      [
        {
          key: 'key',
          label: 'label',
        },
      ],
      data.defaultValue
    );

    expect(result).toBeInstanceOf(HTMLSelectElement);
    expect(result.querySelector('option')?.textContent).toBe(data.defaultValue);
    expect(result.querySelector('option')?.value).toBe(data.defaultValue);
    expect(result.querySelector('option')?.disabled).toBeTruthy();
    expect(result.querySelector('option')?.selected).toBeTruthy();
  });

  test('createCheckbox(): should create checkbox', () => {
    const result = createCheckbox(data.id, data.title);

    expect(result).toBeInstanceOf(HTMLElement);
    expect(result.querySelector('input')?.id).toBe(data.id);
    expect(result.querySelector('input')?.type).toBe('checkbox');
    expect(result.querySelector('label')?.textContent).toBe(data.title);
  });

  test('createCheckboxContainer(): should create checkbox container', () => {
    const result = createCheckboxContainer([{ key: 'key', label: 'label' }]);

    expect(result).toBeInstanceOf(HTMLElement);
    expect(result.querySelector('input')?.type).toBe('checkbox');
  });

  test('createInputPriceRange(): should create HTMLInputElement', () => {
    const result = createInputPriceRange(data.id, 'placeholder');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe(data.id);
    expect(result.placeholder).toBe('placeholder');
  });

  test('createPriceRnageContainer(): should create HTMLElement', () => {
    const result = createPriceRnageContainer([{ id: 'id', placeholder: 'placeholder' }]);

    expect(result).toBeInstanceOf(HTMLElement);
    expect(result.querySelector('input')).toBeInstanceOf(HTMLInputElement);
    expect(result.querySelector('input')?.id).toBe('id');
    expect(result.querySelector('input')?.placeholder).toBe('placeholder');
  });
});
