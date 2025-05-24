import { AppModel } from '../../../models/state/AppState';
import { LoginPageController } from './controller';
import { LoginPageModel } from './model';
import { LoginPageView } from './view';

export class LoginPage {
  private readonly view: LoginPageView;
  private readonly model: LoginPageModel;

  constructor(appModel: AppModel) {
    this.model = new LoginPageModel();
    this.view = new LoginPageView(this.model);

    new LoginPageController(this.model, this.view, appModel);
    // this.controller = new LoginPageController(this.model, this.view, customerService, appModel);
  }

  public render(): HTMLElement {
    const renderedView = this.view.render();
    return renderedView;
  }
}
