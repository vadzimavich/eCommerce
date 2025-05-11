import { HeaderController } from './headerController';
import { HeaderView } from './headerView';

export class Header {
  private readonly view: HeaderView;
  constructor() {
    // private readonly model: HeaderModel // NOTE: Возможно, в будущем понадобится HeaderModel для локального состояния.
    this.view = new HeaderView();
  }
  public init(): HTMLElement {
    new HeaderController(this.view);
    return this.view.render();
  }
}
