import { NotFoundController } from './not-found-controller';
import { NotFoundView } from './not-found-view';

export class NotFound {
  private readonly view: NotFoundView;

  constructor() {
    this.view = new NotFoundView();
  }
  public init(): HTMLElement {
    new NotFoundController(this.view);
    return this.view.render();
  }
}
