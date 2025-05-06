import { createButton, createElement } from '../../utils/dom-helpers';
import { HeaderController } from './headerController';

export class HeaderView {
  private navContainer: HTMLElement;

  constructor(private controller: HeaderController) {
    this.navContainer = createElement({ tag: 'nav', classes: ['nav'] });
  }

  public render(): HTMLElement {
    const buttonHome = createButton({ text: 'Home', classes: ['nav_btn', 'button'] });
    buttonHome.dataset.route = '/home';

    const buttonLogin = createButton({ text: 'Login', classes: ['nav_btn', 'button'] });
    buttonLogin.dataset.route = '/login';

    this.navContainer.append(buttonHome, buttonLogin);

    Array.from(this.navContainer.children).forEach((item) => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', () => {
          const route = item.dataset.route;
          if (route) {
            this.controller.navigate(route);
          }
        });
      }
    });
    return this.navContainer;
  }
}
