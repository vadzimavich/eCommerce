import { CategoryData } from '../models/types/api-types';
import { elementCreator } from './dom-helpers';

export const createSelectCatalogSort = (
  id: string,
  optoins: string[],
  values: string[],
  addClass: string[]
): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input', ...addClass],
    attributes: {
      name: 'sort',
      type: 'select',
      id: id,
      required: '',
    },
  });

  optoins.forEach((item, index) => {
    const option = elementCreator(document.createElement('option'), {
      attributes: {
        value: values[index],
      },
      content: item[0].toUpperCase() + item.slice(1),
    });
    select.append(option);
  });
  return select;
};

export const createInputCatalogSearch = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'catalog-search',
      type: 'text',
      id: id,
      placeholder: 'Search for...',
    },
  });

  return input;
};

export const createFilterSection = (title: string, content: HTMLElement): HTMLElement => {
  const details = elementCreator(document.createElement('details'), {
    classNames: ['filters__section', 'filter-section'],
    attributes: { open: '' },
  });
  const summary = elementCreator(document.createElement('summary'), { content: title });
  details.append(summary, content);
  return details;
};

export const createCategorySelect = (
  id: string,
  categories: CategoryData[] | null,
  defaultValue: string,
  noData?: string
): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input', 'filter-select'],
    attributes: {
      name: 'category',
      type: 'select',
      id: id,
    },
  });
  const defaultOption = elementCreator(document.createElement('option'), { content: defaultValue });
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  if (!categories || categories.length === 0) {
    const errorCategoryOption = elementCreator(document.createElement('option'), { content: noData });
    errorCategoryOption.disabled = true;
    errorCategoryOption.selected = false;
    select.appendChild(errorCategoryOption);
  } else {
    createOptionsSelectCategory(select, categories);
  }

  return select;
};

export const createOptionsSelectCategory = (select: HTMLSelectElement, options: CategoryData[]): void => {
  options.forEach((item) => {
    const category = elementCreator(document.createElement('option'), {
      content: item.name,
      attributes: {
        value: item.id,
      },
    });
    select.appendChild(category);
  });
};

export const createEcoClassSelect = (
  id: string,
  categories: { key: string; label: string }[],
  defaultValue: string
): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input', 'filter-select'],
    attributes: {
      name: 'eco-class',
      type: 'select',
      id: id,
    },
  });
  const defaultOption = elementCreator(document.createElement('option'), { content: defaultValue });
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  categories.forEach((item) => {
    const category = elementCreator(document.createElement('option'), {
      content: item.label,
      attributes: {
        value: item.key,
      },
    });
    select.appendChild(category);
  });
  return select;
};

export const createCheckbox = (idInput: string, contentText: string): HTMLElement => {
  const wrapper = elementCreator(document.createElement('div'));
  const checkbox = elementCreator(document.createElement('input'), { attributes: { type: 'checkbox', id: idInput } });
  const label = elementCreator(document.createElement('label'), {
    attributes: { for: idInput },
    content: contentText,
  });

  wrapper.append(checkbox, label);
  return wrapper;
};

export const createCheckboxContainer = (checkboxCategory: { key: string; label: string }[]): HTMLElement => {
  const container = elementCreator(document.createElement('div'), { classNames: ['checkbox-container'] });
  checkboxCategory.forEach((item) => {
    const checkbox = createCheckbox(item.key, item.label);
    container.appendChild(checkbox);
  });
  return container;
};
