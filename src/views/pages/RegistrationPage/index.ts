import { RegistrationController } from './controller';
import { RegistrationModel } from './model';
import { RegistrationView } from './View/view';

export class RegistrationPage {
  private readonly view: RegistrationView;
  private readonly model: RegistrationModel;

  constructor() {
    this.model = new RegistrationModel();
    this.view = new RegistrationView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new RegistrationController(this.model, this.view);
    return render;
  }
}
