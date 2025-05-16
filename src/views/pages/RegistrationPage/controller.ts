import { route } from '../../../app';
import { CustomerService } from '../../../models/services/AuthService';
import { RegistrationModel } from './model';
import { RegistrationView } from './View/view';

export class RegistrationController {
  private readonly service: CustomerService;

  constructor(
    private readonly model: RegistrationModel,
    private readonly view: RegistrationView
  ) {
    this.service = new CustomerService();
    this.handlerSubmitForm();
    this.navigateToSingIn();
    this.handlerViewPassword();
    this.eventCheckbox();
    this.handlerElementsForm();
  }

  private eventCheckbox(): void {
    Array.from(this.view.form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement && element.type === 'checkbox') {
        element.addEventListener('input', () => {
          this.model.setDataForm(element.id, `${element.checked}`);
        });
      }
    });
  }

  private handlerElementsForm(): void {
    const submitButton = this.view.form.querySelector('button[type="submit"]');

    Array.from(this.view.form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
        if (element.required === true) {
          let modifiedElement = element;

          if (submitButton instanceof HTMLButtonElement) {
            if (element.name === 'country') {
              const wrapper = element.closest('.reg__inputs__wrapper');
              const postalCode = wrapper?.querySelector('input[name="postal-code"]');

              if (postalCode instanceof HTMLInputElement) {
                modifiedElement = postalCode;
                element.addEventListener('change', () => {
                  this.model.updateData(modifiedElement);
                  this.changeButtonSubmit(submitButton);
                });
              }
            } else {
              element.addEventListener('input', () => {
                this.model.updateData(modifiedElement);
                this.changeButtonSubmit(submitButton);
              });
            }
          }

          this.model.updateData(element);
        }
      }
    });
  }

  private changeButtonSubmit(button: HTMLButtonElement): void {
    if (this.model.checkValues()) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }

  private handlerSubmitForm(): void {
    const form = this.view.form;

    form.addEventListener('submit', async (event: SubmitEvent) => {
      event.preventDefault();

      this.service.registerCustomer(this.model.createCustomerSignUpBody());
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
