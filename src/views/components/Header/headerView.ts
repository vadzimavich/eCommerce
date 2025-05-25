import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { HeaderModel } from './headerModel';

export class HeaderView {
  private readonly header: HTMLElement;
  private readonly navContainer: HTMLElement;
  private readonly logoContainer: HTMLElement;
  private readonly cartIconAnchor: HTMLAnchorElement;
  private readonly currentUserAnchor: HTMLElement;
  private readonly logoutIconAnchor: HTMLAnchorElement;
  private readonly buttonBM: HTMLButtonElement;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: HeaderModel
  ) {
    this.header = elementCreator(document.createElement('header'), { classNames: ['header'] });
    this.navContainer = elementCreator(document.createElement('nav'), { classNames: ['header__nav', 'nav'] });
    this.logoContainer = elementCreator(document.createElement('h1'), { classNames: ['header__logo', 'logo'] });
    this.cartIconAnchor = elementCreator(document.createElement('a'), {
      classNames: ['header__icon', 'header__icon-cart'],
      attributes: { 'data-route': '/cart', href: '#/cart', title: 'cart' },
    });
    this.currentUserAnchor = elementCreator(document.createElement('a'), {
      classNames: ['header__icon', 'header__icon-account'],
      attributes: { 'data-route': '/my-account', href: '#/my-account', title: 'my-account' },
    });
    this.logoutIconAnchor = elementCreator(document.createElement('a'), {
      classNames: ['header__icon', 'header__logout', 'header__icon-logout'],
      attributes: { 'data-route': '/home', href: '#/home', title: 'logout' },
    });
    this.buttonBM = elementCreator(document.createElement('button'), {
      classNames: ['header__button-burger'],
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

  public getCartAnhor(): HTMLAnchorElement {
    return this.cartIconAnchor;
  }

  public getCurentUserHead(): HTMLElement {
    return this.currentUserAnchor;
  }

  public getLogoutAnchor(): HTMLAnchorElement {
    return this.logoutIconAnchor;
  }

  public getButtonBM(): HTMLButtonElement {
    return this.buttonBM;
  }

  public updateCurrentUserState(): void {
    const singInSignUpItems = this.getSignInSignUpItems();
    const loginState = this.appModel.getLoginState();
    if (!loginState) {
      singInSignUpItems.forEach((item) => item.classList.remove('hidden'));
      this.logoutIconAnchor.classList.add('hidden');
      this.currentUserAnchor.classList.add('hidden');
    } else {
      singInSignUpItems.forEach((item) => item.classList.add('hidden'));
      this.currentUserAnchor.classList.remove('hidden');
      this.logoutIconAnchor.classList.remove('hidden');
    }
  }

  public updateViewActivePage(): void {
    const modelRoute = this.appModel.getCurrentRoute();
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
          if (route === '/cart') {
            anchor.classList.remove('active');
          }
        }
      }

      if (modelRoute === '/') {
        const anchorHome = navItems[0].firstElementChild;
        if (anchorHome) {
          anchorHome.classList.add('active');
        }
      }
    }
  }

  public toggleShowBurgerMenu(): void {
    const state = this.model.getBurgerMenuState();
    if (state) {
      this.navContainer.classList.add('open');
      document.body.classList.add('overlay');
    } else {
      this.navContainer.classList.remove('open');
      document.body.classList.remove('overlay');
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
    const cart = this.buildCartElement();
    const logout = this.buildLogoutElement();
    const account = this.buildUserAccountElement();

    items.forEach((item) => {
      const navListItem = elementCreator(document.createElement('li'), {
        classNames: ['nav-list__item'],
      });
      const anchorItem = elementCreator(document.createElement('a'), {
        content: item.label,
        attributes: { 'data-route': item.route, href: `#${item.route}` },
      });

      navListItem.append(anchorItem);
      navList.append(navListItem);
    });

    userItem.append(cart, account, logout);
    this.navContainer.append(navList, userItem);
  }

  private buildCartElement(): HTMLElement {
    const iconCart = elementCreator(document.createElement('svg'), {
      classNames: ['nav-user__cart-icon', 'header__icon', 'header__icon-cart'],
      attributes: { alt: 'cart-icon' },
    });
    this.cartIconAnchor.append(iconCart);
    return this.cartIconAnchor;
  }

  private buildLogoutElement(): HTMLElement {
    const iconLogout = elementCreator(document.createElement('svg'), {
      classNames: ['header__logout-icon', 'header__icon', 'header__icon-logout'],
      attributes: { alt: 'logout-icon' },
    });

    this.logoutIconAnchor.append(iconLogout);
    return this.logoutIconAnchor;
  }

  private buildHeader(): HTMLElement {
    const headerWrapper = elementCreator(document.createElement('div'), { classNames: ['header__wrapper'] });
    this.buildNavContainer();
    const logo = this.buildLogoElement();
    const buttonBM = this.buildButtonBm();
    headerWrapper.append(logo, this.navContainer, buttonBM);
    return headerWrapper;
  }

  private buildUserAccountElement(): HTMLElement {
    const iconLogout = elementCreator(document.createElement('svg'), {
      classNames: ['header__logout-icon', 'header__icon', 'header__icon-account'],
      attributes: { alt: 'account-icon' },
    });

    this.currentUserAnchor.append(iconLogout);
    return this.currentUserAnchor;
  }

  private buildButtonBm(): HTMLButtonElement {
    const dot = elementCreator(document.createElement('span'), {
      classNames: ['burger-dot'],
    });
    this.buttonBM.append(dot);
    return this.buttonBM;
  }

  private getSignInSignUpItems(): HTMLElement[] {
    const coinElementsForHidden = 2;
    const container = this.navContainer?.children[0];

    if (!(container instanceof HTMLElement)) return [];

    const elements = Array.from(container.children);
    const elementsLiArray: HTMLElement[] = [];

    for (let i = elements.length - 1; i >= 0 && elementsLiArray.length < coinElementsForHidden; i--) {
      const element = elements[i];
      if (element instanceof HTMLElement) {
        elementsLiArray.push(element);
      }
    }

    return elementsLiArray;
  }
}
