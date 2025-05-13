import { route } from '../../../app';
import { RegistrationView } from './View/view';

export class RegistrationController {
  constructor(private readonly view: RegistrationView) {
    this.handlerSubmitForm();
    this.navigateToSingIn();
    this.handlerViewPassword();
  }

  private handlerSubmitForm(): void {
    const form = this.view.form;

    form.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();

      const target = event.target;
      if (target instanceof HTMLElement) {
        const rout = target.getAttribute('data-route');
        if (rout) {
          route.navigate('/home');
        }
      }
    });
  }

  private handlerViewPassword(): void {
    const password = this.view.form.querySelector('#password');
    const buttonViewPassword = this.view.form.querySelector('#password-view');

    if (buttonViewPassword instanceof HTMLButtonElement) {
      buttonViewPassword.addEventListener('click', () => {
        const isView = password?.getAttribute('type') === 'text';

        if (isView) {
          password?.setAttribute('type', 'password');
          buttonViewPassword.classList.remove('view');
        } else {
          password?.setAttribute('type', 'text');
          buttonViewPassword.classList.add('view');
        }
      });
    }
  }

  private navigateToSingIn(): void {
    const button = this.view.linkNavigate;

    button.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const rout = target.getAttribute('data-route');
        if (rout) {
          route.navigate(rout);
        }
      }
    });
  }
}
