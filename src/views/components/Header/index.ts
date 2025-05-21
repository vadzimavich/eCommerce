import { AppModel } from '../../../models/state/AppState';
import { HeaderController } from './headerController';
import { HeaderModel } from './headerModel';
import { HeaderView } from './headerView';

export class Header {
  private readonly view: HeaderView;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: HeaderModel
  ) {
    this.view = new HeaderView(this.appModel, this.model);
  }
  public render(): HTMLElement {
    const headerElement = this.view.render();
    new HeaderController(this.appModel, this.model, this.view);
    return headerElement;
  }
}
