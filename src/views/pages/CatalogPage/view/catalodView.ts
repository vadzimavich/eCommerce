import { elementCreator } from '../../../../utils/dom-helpers';
import { CatalogModel } from '../catalogModel';
import { FiltersContent } from './constant-conrent';
import * as filersItems from '../../../../utils/catalog-inputs';
import { createOptionsSelectCategory } from '../../../../utils/catalog-inputs';

export class CatalogView {
  private readonly container: HTMLElement;
  private readonly filtersContainer: HTMLFormElement;
  private categorySelect: HTMLSelectElement;
  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['page-wrapper', 'catalog'] });
    this.filtersContainer = elementCreator(document.createElement('form'), {
      classNames: ['catalog-left', 'section-item'],
    });
    this.categorySelect = filersItems.createCategorySelect(
      'categoryId',
      null,
      FiltersContent.Category_Default_Option,
      FiltersContent.Category_Error
    );
  }

  public render(): HTMLElement {
    this.buildFilters();
    this.container.append(this.filtersContainer);
    return this.container;
  }

  public getFiltersContainer(): HTMLFormElement {
    return this.filtersContainer;
  }

  public getSelectCategory(): HTMLSelectElement {
    return this.categorySelect;
  }

  public updateCategories(): void {
    const categories = this.model.getCategories();

    this.categorySelect.replaceChildren();

    const defaultOption = elementCreator(document.createElement('option'), {
      content: FiltersContent.Category_Default_Option,
      attributes: { value: '' },
    });
    defaultOption.disabled = true;
    defaultOption.selected = true;
    this.categorySelect.appendChild(defaultOption);

    createOptionsSelectCategory(this.categorySelect, categories);
  }

  public showNoCategoryOption(): void {
    this.categorySelect.replaceChildren();

    const defaultOption = elementCreator(document.createElement('option'), {
      content: FiltersContent.Category_Default_Option,
      attributes: { value: '' },
    });
    defaultOption.disabled = true;
    defaultOption.selected = true;

    const noDataOption = elementCreator(document.createElement('option'), {
      content: FiltersContent.Category_Error,
      attributes: { value: '' },
    });
    noDataOption.disabled = true;

    this.categorySelect.append(defaultOption, noDataOption);
  }

  private buildFilters(): void {
    const filtersTitle = elementCreator(document.createElement('h3'), {
      content: FiltersContent.Title,
      classNames: ['filters__title'],
    });

    const categorySection = filersItems.createFilterSection(FiltersContent.Summary_Categoty, this.categorySelect);

    this.filtersContainer.append(filtersTitle, categorySection);
  }
}
