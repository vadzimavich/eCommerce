import { route } from '../../../app';
import { AppModel } from '../../../models/state/AppState';
import { RegistrationModel } from './model';
import { RegistrationView } from './View/view';

export class RegistrationController {
  constructor(
    private readonly appModel: AppModel,
    private readonly model: RegistrationModel,
    private readonly view: RegistrationView
  ) {
    this.handlerSubmitForm();
    this.navigateToSingIn();
    this.handlerViewPassword();
    this.eventCheckbox();
    this.handlerElementsForm();
    this.handlerClickCheckboxShippingToBill();
    this.model.subscribeSubmitButtonListener(() => this.handlerButtonSubmit());
    this.model.subscribechekboxBillToShippingListener(() => this.toggleCheckboxDisableState());
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
    Array.from(this.view.form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
        if (element.required === true) {
          let modifiedElement = element;

          if (element.name === 'country') {
            const wrapper = element.closest('.reg__inputs__wrapper');
            const postalCode = wrapper?.querySelector('input[name="postal-code"]');

            if (postalCode instanceof HTMLInputElement) {
              modifiedElement = postalCode;
              element.addEventListener('change', () => {
                this.model.updateData(modifiedElement);
              });
            }
          } else {
            element.addEventListener('input', () => {
              this.model.updateData(modifiedElement);
            });
          }
          this.model.updateData(element);
        }
      }
    });
  }

  private handlerSubmitForm(): void {
    const form = this.view.form;

    form.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      const currentUser = this.model.getDataForm()['first-name'];
      this.appModel.setCurrentUser(currentUser);
      console.log('getDataForm', this.model.getDataForm());
      route.navigate('/home');
    });
  }

  private handlerViewPassword(): void {
    const buttonViewPassword = this.view.getButtonViewPassword();
    buttonViewPassword.addEventListener('click', () => {
      this.view.updateViewPassword();
    });
  }

  private handlerClickCheckboxShippingToBill(): void {
    const checkbox = this.view.getCheckboxBillToShipping().firstElementChild;
    if (checkbox instanceof HTMLInputElement) {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.model.copyDataShippingToBilling();
          this.view.updateBillingFields();
        } else {
          this.model.clearDataBillingFields();
          this.view.updateBillingFields();
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

  private handlerButtonSubmit(): void {
    this.view.changeButtonSubmit();
  }

  private toggleCheckboxDisableState(): void {
    this.view.updateViewChekboxShippingToBill();
  }
}
