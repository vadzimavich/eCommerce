import { LoginPageModel } from './model';
import { LoginPageView } from './view';
import { route } from '../../../app';

export class LoginPageController {
  constructor(
    private readonly model: LoginPageModel,
    private readonly view: LoginPageView
  ) {
    this.attachInputListeners();
    this.attachNavigationListeners();
    this.view.updateSubmitButtonState();
  }

  private attachInputListeners(): void {
    const inputsToListen = [this.view.emailInput, this.view.passwordInput];

    inputsToListen.forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          this.model.updateFieldState(input);
          this.view.updateSubmitButtonState();
          this.view.clearLoginError();
        });
      }
    });
  }

  private attachNavigationListeners(): void {
    if (this.view.linkToRegistration) {
      this.view.linkToRegistration.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        const target = event.currentTarget;
        if (target instanceof HTMLAnchorElement) {
          const path = target.getAttribute('data-route');
          if (path) {
            route.navigate(path);
          }
        }
      });
    }
  }
}
