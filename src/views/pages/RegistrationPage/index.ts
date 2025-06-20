import { AppModel } from '../../../models/state/AppState';
import { RegistrationController } from './controller';
import { RegistrationModel } from './model';
import { RegistrationView } from './View/view';

export class RegistrationPage {
  private readonly view: RegistrationView;
  private readonly model: RegistrationModel;

  constructor(private readonly appModel: AppModel) {
    this.model = new RegistrationModel();
    this.view = new RegistrationView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new RegistrationController(this.appModel, this.model, this.view);
    return render;
  }
}
