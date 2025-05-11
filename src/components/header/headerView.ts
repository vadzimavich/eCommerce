import { AppModel } from '../../models/state/AppState';
import ElementCreator from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;
  private logoContainer: HTMLElement;
  private cartIconContainer: HTMLElement;
  private currentUserHead: HTMLElement;
  private logoutContainer: HTMLElement;

  constructor(private readonly appModel: AppModel) {
    this.headerContainer = ElementCreator.element({ tag: 'header', classNames: ['header'] });
    this.navContainer = ElementCreator.element({ tag: 'nav', classNames: ['header__nav', 'nav'] });
    this.logoContainer = ElementCreator.element({ classNames: ['header__logo', 'logo'] });
    this.cartIconContainer = ElementCreator.element({ classNames: ['header__cart', 'header__cart-wrapper'] });
    this.currentUserHead = ElementCreator.element({ tag: 'span', classNames: ['header__user'] });
    this.logoutContainer = ElementCreator.element({ classNames: ['header__logout'] });
  }

  public render(): HTMLElement {
    this.buildNavButtons();
    const logo = this.buildLogoElement();
    const cart = this.buildCartElement();
    const userContainer = ElementCreator.element({ classNames: ['header__user-wrapper'] });
    userContainer.append(this.currentUserHead, cart);
    const logout = this.buildLogoutElement();
    this.headerContainer.append(logo, this.navContainer, userContainer, logout);
    return this.headerContainer;
  }

  public getNavContainer(): HTMLElement {
    return this.navContainer;
  }

  public getLogoContainer(): HTMLElement {
    return this.logoContainer;
  }

  public getCartContainer(): HTMLElement {
    return this.cartIconContainer;
  }

  public getCurentUserHead(): HTMLElement {
    return this.currentUserHead;
  }

  public getLogoutContainer(): HTMLElement {
    return this.logoutContainer;
  }

  public updateCurrentUserState(): void {
    const user = this.appModel.getCurrentUser();
    if (!user) {
      this.logoutContainer.style.visibility = 'hidden';
      this.currentUserHead.textContent = '';
      return;
    }

    this.currentUserHead.textContent = user;
    this.logoutContainer.style.visibility = 'visible';
  }

  private buildLogoElement(): HTMLElement {
    const logoImg = ElementCreator.element({
      tag: 'img',
      attributes: { src: '../assets/logo/logo.png', alt: 'app-logo' },
    });
    this.logoContainer.append(logoImg);

    return this.logoContainer;
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
        classNames: ['nav-item', 'nav-item__btn', 'btn'],
        content: item.label,
        attributes: { 'data-route': item.route },
      });
      this.navContainer.append(button);
    });
  }

  private buildCartElement(): HTMLElement {
    const iconCart = ElementCreator.element({
      tag: 'img',
      classNames: ['header__cart-icon'],
      attributes: { src: '../assets/icons/header-icons/header-cart.svg', alt: 'cart-icon' },
    });
    this.cartIconContainer.append(iconCart);
    return this.cartIconContainer;
  }

  private buildLogoutElement(): HTMLElement {
    const iconLogout = ElementCreator.element({
      tag: 'img',
      classNames: ['header__logout-icon'],
      attributes: { src: '../assets/icons/header-icons/header-logout.svg', alt: 'logout-icon' },
    });
    this.logoutContainer.append(iconLogout);
    return this.logoutContainer;
  }
}
