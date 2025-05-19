import { elementCreator } from '../../../utils/dom-helpers';
import * as formInputs from '../../../utils/form-inputs';
import { LoginPageModel } from './model';

export class LoginPageView {
  public readonly form: HTMLFormElement;
  public readonly emailInput: HTMLInputElement;
  public readonly passwordInput: HTMLInputElement;
  public readonly passwordViewButton?: HTMLButtonElement;
  public readonly submitButton: HTMLButtonElement;
  public readonly linkToRegistration: HTMLAnchorElement;
  private readonly container: HTMLElement;
  // private errorContainerGeneral: HTMLElement | null = null;

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
    const passwordWrapper = this.createInputWrapper('Password', this.passwordInput); // TODO: Password в константу
    const passwordFieldContainer = passwordWrapper.querySelector('.login__input__container');
    if (passwordFieldContainer && this.passwordViewButton) {
      this.passwordInput.classList.add('password-input-field');
      passwordFieldContainer.classList.add('password__container');
      passwordFieldContainer.append(this.passwordViewButton);
    }

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

  private createInputWrapper(labelContent: string, inputElement: HTMLInputElement): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['reg__input__wrapper', 'login-form__input-wrapper'],
    });

    if (!inputElement.id) {
      inputElement.id = `${labelContent.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(16).slice(2, 8)}`;
    }

    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputElement.id },
      content: labelContent,
    });

    const requiredSpan = elementCreator(document.createElement('span'), {
      classNames: ['input_required'],
      content: ' *', // TODO: из констант
    });
    label.append(requiredSpan);

    const inputContainer = elementCreator(document.createElement('div'), { classNames: ['login__input__container'] });
    inputContainer.append(inputElement);
    wrapper.append(label, inputContainer);

    return wrapper;
  }
}
