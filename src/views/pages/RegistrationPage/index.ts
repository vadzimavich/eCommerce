import { RegistrationView } from './View/view';

export class RegistrationPage {
  private readonly view: RegistrationView;

  constructor() {
    this.view = new RegistrationView();
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
