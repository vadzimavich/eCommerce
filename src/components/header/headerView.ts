import { AppModel } from '../../models/state/AppState';
import ElementCreator from '../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;
  private logoContainer: HTMLElement;
  private inputSearchContainer: HTMLElement;
  private cartIconContainer: HTMLElement;
  private currentUserHead: HTMLElement;

  constructor(private readonly appModel: AppModel) {
    this.headerContainer = ElementCreator.element({ tag: 'header', classNames: ['header'] });
    this.navContainer = ElementCreator.element({ tag: 'nav', classNames: ['header__nav', 'nav'] });
    this.logoContainer = ElementCreator.element({ classNames: ['header__logo', 'logo'] });
    this.inputSearchContainer = ElementCreator.element({ classNames: ['header__search', 'header__search-wrapper'] });
    this.cartIconContainer = ElementCreator.element({ classNames: ['header__cart', 'header__cart-wrapper'] });
    this.currentUserHead = ElementCreator.element({
      tag: 'span',
      classNames: ['header__user'],
      content: this.appModel.getCurrentUser(),
    });
  }

  public render(): HTMLElement {
    const nav = this.buildNavButtons();
    const logo = this.buildLogoElement();
    const search = this.buildSearchElement();
    const cart = this.buildCartElement();
    const userContainer = ElementCreator.element({ classNames: ['header__user-wrapper'] });
    userContainer.append(this.currentUserHead, cart);
    this.headerContainer.append(logo, nav, search, userContainer);
    return this.headerContainer;
  }

  public getNavContainer(): HTMLElement {
    return this.navContainer;
  }

  public getLogoContainer(): HTMLElement {
    return this.logoContainer;
  }

  public getSearchContainer(): HTMLElement {
    return this.inputSearchContainer;
  }

  public getCartContainer(): HTMLElement {
    return this.cartIconContainer;
  }

  public getCurentUserHead(): HTMLElement {
    return this.currentUserHead;
  }

  public updateCurrentUserHead(): void {
    const user = this.appModel.getCurrentUser();

    if (!user) {
      return;
    }

    this.currentUserHead.textContent = user;
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
    const logo = ElementCreator.element({
      tag: 'img',
      classNames: ['header__logo', 'logo'],
      attributes: { src: '../assets/logo/logo.png', alt: 'app-logo' },
    });
    this.logoContainer.append(logo);
    return this.logoContainer;
  }

  private buildSearchElement(): HTMLElement {
    const inputSearch = ElementCreator.element({
      tag: 'input',
      classNames: ['header__search-input', 'input'],
      attributes: { type: 'text' },
    });
    const iconSearch = ElementCreator.element({
      tag: 'img',
      classNames: ['header__search-icon'],
      attributes: { src: '../assets/icons/header-icons/header-search.svg', alt: 'search-icon' },
    });
    this.inputSearchContainer.append(inputSearch, iconSearch);
    return this.inputSearchContainer;
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
}
