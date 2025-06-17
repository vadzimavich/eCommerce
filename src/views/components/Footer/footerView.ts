import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';

export class FooterView {
  private readonly footer: HTMLElement;
  constructor(private readonly appModel: AppModel) {
    this.footer = elementCreator(document.createElement('footer'), { classNames: ['header'] });
    // this.navContainer = elementCreator(document.createElement('nav'), { classNames: ['header__nav', 'nav'] });
    // this.logoContainer = elementCreator(document.createElement('h1'), { classNames: ['header__logo', 'logo'] });
    // this.cartIconAnchor = elementCreator(document.createElement('a'), {
    //   classNames: ['header__icon', 'header__icon-cart'],
    //   attributes: { 'data-route': '/cart', href: '#/cart', title: 'cart' },
    // });
    // this.cointProductsInCartContainer = elementCreator(document.createElement('div'), {
    //   classNames: ['header__icon-coin'],
    // });
    // this.currentUserAnchor = elementCreator(document.createElement('a'), {
    //   classNames: ['header__icon', 'header__icon-account'],
    //   attributes: { 'data-route': '/my-account', href: '#/my-account', title: 'my-account' },
    // });
    // this.logoutIconAnchor = elementCreator(document.createElement('a'), {
    //   classNames: ['header__icon', 'header__logout', 'header__icon-logout'],
    //   attributes: { 'data-route': '/home', href: '#/home', title: 'logout' },
    // });
    // this.buttonBM = elementCreator(document.createElement('button'), {
    //   classNames: ['header__button-burger'],
    // });
  }

  public render(): HTMLElement {
    return this.footer;
  }
}
