import { AppModel } from '../../models/state/AppState';
import { HeaderController } from './headerController';
import { HeaderView } from './headerView';

export class Header {
  private readonly view: HeaderView;
  private readonly appModel: AppModel;
  constructor() {
    // private readonly model: HeaderModel // NOTE: Возможно, в будущем понадобится HeaderModel для локального состояния.
    this.view = new HeaderView();
    this.appModel = new AppModel();
  }
  public init(): HTMLElement {
    new HeaderController(this.appModel, this.view);
    return this.view.render();
  }
}
