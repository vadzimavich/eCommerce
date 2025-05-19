import { AppModel } from '../../../models/state/AppState';
import { CustomerService } from '../../../models/services/AuthService';
import { LoginPageModel } from './model';
import { LoginPageView } from './view';
import { route } from '../../../app';
import { CustomerSignInResult } from '@commercetools/platform-sdk';

export class LoginPageController {
  constructor(
    private readonly model: LoginPageModel,
    private readonly view: LoginPageView,
    private readonly customerService: CustomerService,
    private readonly appModel: AppModel
  ) {
    this.attachInputListeners();
    this.attachFormSubmitListener();
    this.attachNavigationListeners();
    this.attachPasswordToggleListener();
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

  private attachFormSubmitListener(): void {
    if (this.view.form) {
      this.view.form.addEventListener('submit', this.handleFormSubmit);
    }
  }

  private handleFormSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (!this.model.isFormValid()) {
      this.view.displayLoginError('Please ensure all fields are correctly filled.'); // TODO: в константы
      return;
    }
    const loginData = this.model.getLoginData();
    this.view.clearLoginError();
    if (this.view.submitButton) {
      this.view.submitButton.disabled = true;
    }
    try {
      const signInResult: CustomerSignInResult | Error = await this.customerService.loginCustomer(loginData);
      if (signInResult && !(signInResult instanceof Error)) {
        const userName = signInResult.customer.firstName || signInResult.customer.email;
        if (userName) {
          this.appModel.setCurrentUser(userName);
        } else {
          this.appModel.setCurrentUser('Authenticated User');
        }
        route.navigate('/');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.'; // TODO: в константы
      if (error && typeof error === 'object' && 'body' in error) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const ctError = error as { body?: { message?: string; errors?: [{ code?: string; message?: string }] } }; // Осторожное приведение
        if (ctError.body?.message) {
          errorMessage = ctError.body.message;
        } else if (ctError.body?.errors && ctError.body.errors.length > 0 && ctError.body.errors[0].message) {
          errorMessage = ctError.body.errors[0].message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.view.displayLoginError(errorMessage);
    } finally {
      if (this.view.submitButton && this.view.form.contains(this.view.submitButton)) {
        this.view.submitButton.disabled = false;
      }
    }
  };

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

  private attachPasswordToggleListener(): void {
    if (this.view.passwordViewButton) {
      this.view.passwordViewButton.addEventListener('click', () => {
        this.view.togglePasswordVisibility();
      });
    }
  }
}
