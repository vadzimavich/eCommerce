import { Category } from '@commercetools/platform-sdk';
import { CategoryData } from '../../../models/types/api-types';
import { parserCategories } from '../../../utils/parsers';

export class FooterModel {
  private categories: CategoryData[] = [];

  public setCategories(data: Category[]): void {
    this.categories = parserCategories(data);
  }

  public getCategories(): CategoryData[] {
    return this.categories;
  }
}
