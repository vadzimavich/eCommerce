import { route } from '../../../app';
import { CustomerService } from '../../../models/services/AuthService';
import { AppModel } from '../../../models/state/AppState';
import { HeaderModel } from './headerModel';
import { HeaderView } from './headerView';

export class HeaderController {
  private readonly service: CustomerService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: HeaderModel,
    private readonly view: HeaderView
  ) {
    this.service = CustomerService.getInstance();
    this.addEventListeners();
    this.handleCurrentUserHead();
    this.handleCurrentPage();
    this.appModel.subscribeUsersListener(() => this.handleCurrentUserHead());
    this.appModel.subscribeCurrentPageListener(() => this.handleCurrentPage());
    this.model.subscribeBurgerMenuListener(() => this.view.toggleShowBurgerMenu());
  }

  private addEventListeners(): void {
    this.handleNavigationClick();
    this.handleLogoClick();
    this.handleLogoutClick();
    this.handleClickBurgerMenuButton();
  }

  private handleNavigationClick(): void {
    const navContainer = this.view.getNavContainer();

    navContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof HTMLElement) {
        const anchor = target.closest('a');

        if (anchor instanceof HTMLAnchorElement) {
          const rout = anchor.getAttribute('data-route');
          this.model.setBurgerMenuState(false);
          if (rout) {
            route.navigate(rout);
          }
        }
      }
    });
  }

  private handleLogoClick(): void {
    const logoContainer = this.view.getLogoContainer();
    logoContainer.addEventListener('click', () => {
      route.navigate('/home');
    });
  }

  private handleLogoutClick(): void {
    const logoutContainer = this.view.getLogoutAnchor();
    logoutContainer.addEventListener('click', () => {
      this.service.logoutCustomer();
      route.navigate('/home');
      this.appModel.setCurrentUser('');
    });
  }

  private handleCurrentUserHead(): void {
    this.view.updateCurrentUserState();
  }

  private handleCurrentPage(): void {
    this.view.updateViewActivePage();
  }

  private handleClickBurgerMenuButton(): void {
    const buttonBM = this.view.getButtonBM();
    buttonBM.addEventListener('click', () => {
      const currentState = this.model.getBurgerMenuState();
      const newState = !currentState;
      this.view.toggleShowBurgerMenu();
      this.model.setBurgerMenuState(newState);
    });
  }
}
