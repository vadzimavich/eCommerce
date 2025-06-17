import { AppModel } from '../../../models/state/AppState';
import { FooterController } from './footerController';
import { FooterView } from './footerView';

export class Footer {
  private readonly view: FooterView;

  constructor(private readonly appModel: AppModel) {
    this.view = new FooterView(this.appModel);
  }
  public render(): HTMLElement {
    const footerElement = this.view.render();
    new FooterController(this.appModel, this.view);
    return footerElement;
  }
}
