import ElementCreator from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;

  constructor() {
    this.headerContainer = ElementCreator.element({ tag: 'header', classNames: ['header'] });
    this.navContainer = ElementCreator.element({ tag: 'nav', classNames: ['header__nav', 'nav'] });
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
      const button = ElementCreator.button({
        tag: 'button',
        classNames: ['nav-item', 'nav-item__btn'],
        content: item.label,
        attributes: { 'data-route': item.route },
      });
      this.navContainer.append(button);
    });
  }
}
