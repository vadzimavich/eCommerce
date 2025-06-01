import { elementCreator } from '../../../../utils/dom-helpers';
import { CatalogModel } from '../catalogModel';
import { ECO_CLASSES, FiltersContent, Price_Range, Promo_Actions } from './constant-conrent';
import * as filersItems from '../../../../utils/catalog-inputs';
import { createOptionsSelectCategory } from '../../../../utils/catalog-inputs';

export class CatalogView {
  private readonly container: HTMLElement;
  private readonly filtersContainer: HTMLFormElement;
  private readonly categorySelect: HTMLSelectElement;
  private readonly clearFilterButton: HTMLButtonElement;
  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['page-wrapper', 'catalog'] });
    this.filtersContainer = elementCreator(document.createElement('form'), {
      classNames: ['catalog-left', 'section-item', 'filters'],
    });
    this.categorySelect = filersItems.createCategorySelect(
      'categoryId',
      null,
      FiltersContent.Category_Default_Option,
      FiltersContent.Category_Error
    );
    this.clearFilterButton = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'button'],
      content: FiltersContent.Button_Clear,
    });
  }

  public render(): HTMLElement {
    this.container.append(this.buildFilters());
    return this.container;
  }

  public getFiltersContainer(): HTMLFormElement {
    return this.filtersContainer;
  }

  public getSelectCategory(): HTMLSelectElement {
    return this.categorySelect;
  }

  public getButtonClearFilter(): HTMLButtonElement {
    return this.clearFilterButton;
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

  public setActiveCategory(): void {
    console.log(this.categorySelect);
    this.categorySelect.value = 'Furniture';
  }

  public changeClearButton(): void {
    const isFilters = this.model.checkIsFiltred();
    if (!isFilters) {
      this.clearFilterButton.disabled = true;
    } else {
      this.clearFilterButton.disabled = false;
    }
  }

  private buildFilters(): HTMLElement {
    const filtersTitle = elementCreator(document.createElement('h3'), {
      content: FiltersContent.Title,
      classNames: ['filters__title'],
    });

    const filterCommonSection = filersItems.createFilterSection(FiltersContent.Title, this.filtersContainer, [
      'filter-details',
    ]);

    const categorySection = filersItems.createFilterSection(FiltersContent.Summary_Categoty, this.categorySelect);
    const ecoSection = filersItems.createFilterSection(
      FiltersContent.Summary_Eco,
      filersItems.createEcoClassSelect('eco-class', ECO_CLASSES, FiltersContent.Ecology_Default_option)
    );
    const promoActionsSection = filersItems.createFilterSection(
      FiltersContent.Summary_Actions,
      filersItems.createCheckboxContainer(Promo_Actions)
    );
    const priceRange = filersItems.createFilterSection(
      FiltersContent.Sumamary_Price,
      filersItems.createPriceRnageContainer(Price_Range)
    );

    this.filtersContainer.append(
      filtersTitle,
      categorySection,
      ecoSection,
      promoActionsSection,
      priceRange,
      this.clearFilterButton
    );
    filterCommonSection.appendChild(this.filtersContainer);
    return filterCommonSection;
  }
}
