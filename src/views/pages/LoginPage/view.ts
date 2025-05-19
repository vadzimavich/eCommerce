import { elementCreator } from '../../../utils/dom-helpers';
import { LoginPageModel } from './model';

export class LoginPageView {
  private container: HTMLElement;

  constructor(private readonly model: LoginPageModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['login-page'] });
  }

  public render(): HTMLElement {
    const title = elementCreator(document.createElement('h1'), { content: 'Login Page (Placeholder)' });
    this.container.replaceChildren(title);
    return this.container;
  }
}
