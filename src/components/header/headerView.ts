import ElementCreator from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;
  private logoContainer: HTMLElement;

  constructor() {
    this.headerContainer = ElementCreator.element({ tag: 'header', classNames: ['header'] });
    this.navContainer = ElementCreator.element({ tag: 'nav', classNames: ['header__nav', 'nav'] });
    this.logoContainer = ElementCreator.element({ classNames: ['header__logo', 'logo'] });
  }

  public render(): HTMLElement {
    const nav = this.buildNavButtons();
    const logo = this.buildLogoElement();
    this.headerContainer.append(logo, nav);
    return this.headerContainer;
  }

  public getNavContainer(): HTMLElement {
    return this.navContainer;
  }

  public getLogoContainer(): HTMLElement {
    return this.logoContainer;
  }

  private buildNavButtons(): HTMLElement {
    const buttons = ['Home', 'Catalog', 'About Us', 'Login', 'Registration'];

    buttons.forEach((item) => {
      const button = ElementCreator.button({
        tag: 'button',
        classNames: ['nav-item', 'nav-item__btn'],
        content: item,
        attributes: { 'data-route': `/${item.split(' ').join('-').toLowerCase()}` },
      });
      this.navContainer.append(button);
    });

    return this.navContainer;
  }

  private buildLogoElement(): HTMLElement {
    const logo = document.createElement('img');
    logo.src = '../assets/logo/logo.png';
    logo.alt = 'app-logo';
    this.logoContainer.append(logo);
    return this.logoContainer;
  }
}
