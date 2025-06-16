import { route } from '../../../app';
import { CustomerService } from '../../../models/services/AuthService';
import { AppModel } from '../../../models/state/AppState';
import { RegistrationModel } from './model';
import { RegistrationView } from './View/view';

export class RegistrationController {
  private readonly service: CustomerService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: RegistrationModel,
    private readonly view: RegistrationView
  ) {
    this.service = CustomerService.getInstance();
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
      if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement) && element.required) {
        let eventType: 'input' | 'change';
        if (element instanceof HTMLSelectElement) {
          eventType = 'change';
        } else if (element.type === 'checkbox') {
          eventType = 'change';
        } else {
          eventType = 'input';
        }

        element.addEventListener(eventType, () => {
          this.model.updateData(element);
        });

        this.model.updateData(element);
      }
    });
  }

  private handlerSubmitForm(): void {
    const form = this.view.form;

    form.addEventListener('submit', async (event: SubmitEvent) => {
      event.preventDefault();

      const result = await this.service.registerCustomer(this.model.createCustomerSignUpBody());

      if (result && !(result instanceof Error)) {
        this.appModel.login(result);

        this.view.showSuccessModal('You have successfully registered');
        route.navigate('/home');
      } else if (result instanceof Error) {
        this.view.showErrorModal(result.message);
      }
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
