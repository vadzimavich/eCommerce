import { RegistrationController } from './controller';
import { RegistrationView } from './View/view';

export class RegistrationPage {
  private readonly view: RegistrationView;

  constructor() {
    this.view = new RegistrationView();
  }

  public render(): HTMLElement {
    new RegistrationController(this.view);
    return this.view.render();
  }
}
