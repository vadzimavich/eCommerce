import { elementCreator } from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;

  constructor() {
    this.headerContainer = elementCreator(document.createElement('header'), { classNames: ['header'] });
    this.navContainer = elementCreator(document.createElement('nav'), { classNames: ['header__nav', 'nav'] });
  }

  public render(): HTMLElement {
    this.buildNavButtons();
    this.headerContainer.append(this.navContainer);

    return this.headerContainer;
  }

  public getNavContainer(): HTMLElement {
    return this.navContainer;
  }

  private buildNavButtons(): void {
    const buttons = [
      { label: 'Home', route: '/' },
      { label: 'Catalog', route: '/catalog' },
      { label: 'About Us', route: '/about-us' },
      { label: 'Sign In', route: '/sign-in' },
      { label: 'Sign Up', route: '/sign-up' },
    ];

    buttons.forEach((item) => {
      const button = elementCreator(document.createElement('button'), {
        classNames: ['nav-item', 'nav-item__btn'],
        content: item.label,
        attributes: { 'data-route': item.route },
      });
      this.navContainer.append(button);
    });
  }
}
