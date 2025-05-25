import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';

export class CatalogController {
  constructor(
    private readonly model: CatalogModel,
    private readonly view: CatalogView
  ) {}
}
