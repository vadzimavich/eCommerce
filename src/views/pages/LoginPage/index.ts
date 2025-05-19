import { AppModel } from '../../../models/state/AppState';
import { LoginPageController } from './controller';
import { LoginPageModel } from './model';
import { LoginPageView } from './view';

export class LoginPage {
  private readonly view: LoginPageView;
  private readonly model: LoginPageModel;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(appModel: AppModel) {
    this.model = new LoginPageModel();
    this.view = new LoginPageView(this.model);

    new LoginPageController(this.model, this.view);
  }

  public render(): HTMLElement {
    const renderedView = this.view.render();

    return renderedView;
  }
}
