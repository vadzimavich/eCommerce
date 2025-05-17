// import { route } from '../../../app';
import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';

export class HeaderView {
  private headerContainer: HTMLElement;
  private navContainer: HTMLElement;
  private logoContainer: HTMLElement;
  private cartIconContainer: HTMLElement;
  private currentUserHead: HTMLElement;
  private logoutContainer: HTMLElement;

  constructor(private readonly appModel: AppModel) {
    this.headerContainer = elementCreator(document.createElement('header'), { classNames: ['header'] });
    this.navContainer = elementCreator(document.createElement('nav'), { classNames: ['header__nav', 'nav'] });
    this.logoContainer = elementCreator(document.createElement('div'), { classNames: ['header__logo', 'logo'] });
    this.cartIconContainer = elementCreator(document.createElement('div'), {
      classNames: ['header__cart', 'header__cart-wrapper'],
    });
    this.currentUserHead = elementCreator(document.createElement('span'), { classNames: ['header__user'] });
    this.logoutContainer = elementCreator(document.createElement('div'), { classNames: ['header__logout'] });
  }

  public render(): HTMLElement {
    const header = this.buildHeader();
    this.headerContainer.append(header);
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
      this.logoutContainer.classList.remove('visible');
      this.currentUserHead.textContent = '';
      return;
    }

    this.currentUserHead.textContent = user;
    this.logoutContainer.classList.add('visible');
  }

  private buildLogoElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/home', href: '#/home' },
    });
    const logoImg = elementCreator(document.createElement('img'), {
      classNames: ['logo', 'header__logo', 'header__logo-img'],
      attributes: { src: '../assets/logo/logo.png', alt: 'app-logo' },
    });
    anchorItem.append(logoImg);
    this.logoContainer.append(anchorItem);

    return this.logoContainer;
  }

  private buildNavContainer(): void {
    const items = [
      { label: 'Home', route: '/home' },
      { label: 'Catalog', route: '/catalog' },
      { label: 'About Us', route: '/about-us' },
      { label: 'Sign In', route: '/sign-in' },
      { label: 'Sign Up', route: '/sign-up' },
    ];

    const navList = elementCreator(document.createElement('ul'), { classNames: ['nav-list'] });
    const userItem = elementCreator(document.createElement('ul'), { classNames: ['nav-list'] });

    items.forEach((item) => {
      const navListItem = elementCreator(document.createElement('li'), { classNames: ['nav-item', 'nav-list__item'] });
      const anchorItem = elementCreator(document.createElement('a'), {
        content: item.label,
        attributes: { 'data-route': item.route, href: `#${item.route}` },
      });
      navListItem.append(anchorItem);
      navList.append(navListItem);
    });
    userItem.append(this.buildUserContainer());
    this.navContainer.append(navList, userItem);
  }

  private buildCartElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/cart', href: '#/cart', title: 'cart' },
    });
    const iconCart = elementCreator(document.createElement('img'), {
      classNames: ['header__cart-icon'],
      attributes: { src: '../assets/icons/header-icons/header-cart.svg', alt: 'cart-icon' },
    });
    anchorItem.append(iconCart);
    this.cartIconContainer.append(anchorItem);
    return this.cartIconContainer;
  }

  private buildLogoutElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/home', href: '#/home', title: 'logout' },
    });
    const iconLogout = elementCreator(document.createElement('img'), {
      classNames: ['header__logout-icon'],
      attributes: { src: '../assets/icons/header-icons/header-logout.svg', alt: 'logout-icon' },
    });
    anchorItem.append(iconLogout);
    this.logoutContainer.append(anchorItem);
    return this.logoutContainer;
  }

  private buildHeader(): HTMLElement {
    const headerWrapper = elementCreator(document.createElement('div'), { classNames: ['header__wrapper'] });
    this.buildNavContainer();
    const logo = this.buildLogoElement();
    headerWrapper.append(logo, this.navContainer);
    return headerWrapper;
  }

  private buildUserContainer(): HTMLElement {
    const userContainer = elementCreator(document.createElement('div'), { classNames: ['header__user-wrapper'] });
    const cart = this.buildCartElement();
    const logout = this.buildLogoutElement();
    userContainer.append(cart, this.currentUserHead, logout);
    return userContainer;
  }
}
