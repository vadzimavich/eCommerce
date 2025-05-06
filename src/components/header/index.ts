import { AppModel } from '../../models/appModel';
import { HeaderController } from './headerController';
import { HeaderView } from './headerView';

export class Header {
  private readonly view: HeaderView;
  constructor(
    private readonly appModel: AppModel
    // NOTE: Возможно, в будущем понадобится HeaderModel для локального состояния.
    // private readonly model: HeaderModel
  ) {
    this.view = new HeaderView();
  }
  public init(): HTMLElement {
    new HeaderController(this.appModel, this.view);
    return this.view.render();
  }
}
