import { RegistrationController } from './controller';
import { RegistrationView } from './View/view';

export class RegistrationPage {
  private readonly view: RegistrationView;

  constructor() {
    this.view = new RegistrationView();
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new RegistrationController(this.view);
    return render;
  }
}
