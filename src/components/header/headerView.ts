import { createButton, createElement } from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;

  constructor() {
    this.headerContainer = createElement({ tag: 'header', classes: ['header'] });
    this.navContainer = createElement({ tag: 'nav', classes: ['nav'] });
  }

  public render(): HTMLElement {
    this.navContainer = this.renderNavContainer();
    this.headerContainer.append(this.navContainer);
    return this.headerContainer;
  }

  public getNavContainer(): HTMLElement {
    return this.navContainer;
  }

  private renderNavContainer(): HTMLElement {
    const buttons = ['Home', 'Catalog', 'About Us', 'Login', 'Registration'];
    buttons.forEach((item) => {
      const button = createButton({
        text: item,
        classes: ['nav_btn', 'button'],
        attributes: { 'data-route': `/${item.split(' ').join('-').toLowerCase()}` },
      });
      this.navContainer.append(button);
    });
    return this.navContainer;
  }
}
