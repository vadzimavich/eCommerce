import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { HeaderModel } from './headerModel';

export class HeaderView {
  private header: HTMLElement;
  private navContainer: HTMLElement;
  private logoContainer: HTMLElement;
  private cartIconContainer: HTMLElement;
  private currentUserHead: HTMLElement;
  private logoutContainer: HTMLElement;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: HeaderModel
  ) {
    this.header = elementCreator(document.createElement('header'), { classNames: ['header'] });
    this.navContainer = elementCreator(document.createElement('nav'), { classNames: ['header__nav', 'nav'] });
    this.logoContainer = elementCreator(document.createElement('h1'), { classNames: ['header__logo', 'logo'] });
    this.cartIconContainer = elementCreator(document.createElement('div'), {
      classNames: ['header__cart', 'nav-user__cart-wrapper'],
    });
    this.currentUserHead = elementCreator(document.createElement('span'), {
      classNames: ['header__user', 'nav-user__user'],
    });
    this.logoutContainer = elementCreator(document.createElement('div'), {
      classNames: ['header__logout', 'nav-user__logout-wrapper'],
    });
  }

  public render(): HTMLElement {
    const header = this.buildHeader();
    this.header.append(header);
    return this.header;
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

  public updateViewActivePage(): void {
    const modelRoute = this.model.getCurrentRoute();
    const nav = this.navContainer.firstElementChild;
    if (nav) {
      const navItems = nav.children;
      for (let i = 0; i < navItems.length; i++) {
        const li = navItems[i];
        const anchor = li.firstElementChild;

        if (anchor) {
          const route = anchor.getAttribute('data-route');
          if (route === modelRoute) {
            anchor.classList.add('active');
          } else {
            anchor.classList.remove('active');
          }
        }
      }
    }
  }

  private buildLogoElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/home', href: '#/home' },
    });
    const logoImg = elementCreator(document.createElement('img'), {
      classNames: ['logo', 'header__logo-img'],
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

    const navList = elementCreator(document.createElement('ul'), { classNames: ['header__nav-list'] });
    const userItem = elementCreator(document.createElement('ul'), { classNames: ['header__nav-user'] });

    items.forEach((item, index) => {
      const navListItem = elementCreator(document.createElement('li'), {
        classNames: ['nav-list__item'],
      });
      const anchorItem = elementCreator(document.createElement('a'), {
        content: item.label,
        attributes: { 'data-route': item.route, href: `#${item.route}` },
      });
      if (index === 0) {
        anchorItem.classList.add('active');
      }
      navListItem.append(anchorItem);
      navList.append(navListItem);
    });
    const cart = this.buildCartElement();
    const logout = this.buildLogoutElement();
    userItem.append(cart, this.currentUserHead, logout);
    this.navContainer.append(navList, userItem);
  }

  private buildCartElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/cart', href: '#/cart', title: 'cart' },
    });
    const iconCart = elementCreator(document.createElement('svg'), {
      classNames: ['nav-user__cart-icon', 'header__icon', 'header__icon-cart'],
      attributes: { alt: 'cart-icon' },
    });
    anchorItem.append(iconCart);
    this.cartIconContainer.append(anchorItem);
    return this.cartIconContainer;
  }

  private buildLogoutElement(): HTMLElement {
    const anchorItem = elementCreator(document.createElement('a'), {
      attributes: { 'data-route': '/home', href: '#/home', title: 'logout' },
    });
    const iconLogout = elementCreator(document.createElement('svg'), {
      classNames: ['header__logout-icon', 'header__icon', 'header__icon-logout'],
      attributes: {},
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
}
