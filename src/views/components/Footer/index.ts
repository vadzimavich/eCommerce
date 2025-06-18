import { AppModel } from '../../../models/state/AppState';
import { FooterController } from './footerController';
import { FooterModel } from './footerModel';
import { FooterView } from './footerView';

export class Footer {
  private readonly view: FooterView;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: FooterModel
  ) {
    this.view = new FooterView(this.appModel, this.model);
  }
  public render(): HTMLElement {
    const footerElement = this.view.render();
    new FooterController(this.appModel, this.model, this.view);
    return footerElement;
  }
}
