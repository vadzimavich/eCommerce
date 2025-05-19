import { elementCreator } from '../../../utils/dom-helpers';
import * as formInputs from '../../../utils/form-inputs';
import { LoginPageModel } from './model';

export class LoginPageView {
  public readonly form: HTMLFormElement;
  public readonly emailInput: HTMLInputElement;
  public readonly passwordInput: HTMLInputElement;
  public readonly passwordViewButton: HTMLButtonElement;
  public readonly submitButton: HTMLButtonElement;
  public readonly linkToRegistration: HTMLAnchorElement;
  private readonly container: HTMLElement;
  private errorContainerGeneral: HTMLElement | null = null;

  constructor(private readonly model: LoginPageModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['login-page', 'page-wrapper'] });
    this.form = elementCreator(document.createElement('form'), { classNames: ['login-form', 'form'] });

    this.emailInput = formInputs.createInputEmail('login-email');
    this.passwordInput = formInputs.createInputPassword('login-password');

    this.passwordViewButton = elementCreator(document.createElement('button'), {
      classNames: ['password__button-view'],
      attributes: { type: 'button', 'aria-label': 'Show/hide password' },
    });

    this.submitButton = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'button'],
      content: 'Sign In', // TODO: Заменить на константу
      attributes: { type: 'submit', disabled: '' },
    });

    this.linkToRegistration = elementCreator(document.createElement('a'), {
      classNames: ['login-form__link-to-reg', 'navigate__link'],
      content: "Don't have an account? Sign Up", // TODO: Заменить на константу
      attributes: { 'data-route': '/sign-up', href: '#/sign-up' },
    });
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.form.innerHTML = '';

    const title = elementCreator(document.createElement('h1'), {
      classNames: ['login-form__title'],
      content: 'Sign In', // TODO: Заменить на константу
    });

    const emailWrapper = this.createInputWrapper('Email', this.emailInput); // TODO: Email в константу

    const passwordFieldWithButton = elementCreator(document.createElement('div'), {
      classNames: ['password__container'],
    });
    this.passwordInput.classList.add('password-input-field');
    passwordFieldWithButton.append(this.passwordInput);
    if (this.passwordViewButton) {
      passwordFieldWithButton.append(this.passwordViewButton);
    }
    const passwordWrapper = this.createInputWrapper('Password', passwordFieldWithButton);

    const actionsContainer = elementCreator(document.createElement('div'), {
      classNames: ['login-form__actions'],
    });
    actionsContainer.append(this.submitButton);

    const navigationContainer = elementCreator(document.createElement('div'), {
      classNames: ['login-form__navigation', 'navigate'],
    });
    navigationContainer.append(this.linkToRegistration);

    this.form.append(title, emailWrapper, passwordWrapper, actionsContainer, navigationContainer);
    this.container.append(this.form);
    return this.container;
  }

  public updateSubmitButtonState(): void {
    if (this.model.isFormValid()) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }

  public displayLoginError(message: string): void {
    this.clearLoginError();
    this.errorContainerGeneral = elementCreator(document.createElement('div'), {
      classNames: ['error-message', 'login-error'],
      content: message,
    });
    const actionsContainer = this.form.querySelector('.login-form__actions');
    if (actionsContainer) {
      this.form.insertBefore(this.errorContainerGeneral, actionsContainer);
    } else {
      this.form.append(this.errorContainerGeneral);
    }
  }

  public clearLoginError(): void {
    if (this.errorContainerGeneral) {
      this.errorContainerGeneral.remove();
      this.errorContainerGeneral = null;
    }
  }

  public togglePasswordVisibility(): void {
    if (this.passwordInput.type === 'password') {
      this.passwordInput.type = 'text';
      this.passwordViewButton.classList.add('view');
    } else {
      this.passwordInput.type = 'password';
      this.passwordViewButton.classList.remove('view');
    }
  }

  private createInputWrapper(labelContent: string, inputElementOrWrapper: HTMLElement): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['reg__input__wrapper', 'login-form__input-wrapper'],
    });

    const inputField = inputElementOrWrapper.querySelector('input') || inputElementOrWrapper;
    let inputId = '';
    if (inputField instanceof HTMLInputElement) {
      inputId = inputField.id;
    }

    if (!inputId) {
      inputId = `${labelContent.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(16).slice(2, 8)}`;
      if (inputField instanceof HTMLElement) {
        inputField.id = inputId;
      }
    }

    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputId },
      content: labelContent,
    });

    const requiredSpan = elementCreator(document.createElement('span'), {
      classNames: ['input_required'],
      content: '*', // TODO: из констант
    });
    label.append(requiredSpan);

    wrapper.append(label, inputElementOrWrapper);
    return wrapper;
  }
}
