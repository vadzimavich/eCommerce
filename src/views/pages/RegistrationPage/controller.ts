import { route } from '../../../app';
import { RegistrationView } from './View/view';

export class RegistrationController {
  constructor(private readonly view: RegistrationView) {
    this.handlerSubmitForm();
    this.navigateToSingIn();
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
