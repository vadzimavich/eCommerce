import { route } from '../../../app';
import { AppModel } from '../../../models/state/AppState';
import { HeaderModel } from './headerModel';
import { HeaderView } from './headerView';

export class HeaderController {
  constructor(
    private readonly appModel: AppModel,
    private readonly model: HeaderModel,
    private readonly view: HeaderView
  ) {
    this.addEventListeners();
    this.appModel.subscribeUsersListener(() => this.handleCurrentUserHead());
    this.model.subscribeCurrentPageListener(() => this.handleCurrentPage());
    this.handleCurrentUserHead();
    this.handleCurrentPage();
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

          if (rout) {
            route.navigate(rout);
            this.model.setCurrentRoute(rout);
            console.log(this.model.getCurrentRoute());
          }

          if (rout === '/sign-in') {
            this.appModel.setCurrentUser('testUser');
          }
        }
      }
    });
  }

  private handleLogoClick(): void {
    const logoContainer = this.view.getLogoContainer();
    logoContainer.addEventListener('click', () => {
      route.navigate('/home');
      this.model.setCurrentRoute('/home');
    });
  }

  private handleLogoutClick(): void {
    const logoutContainer = this.view.getLogoutAnchor();
    logoutContainer.addEventListener('click', () => {
      route.navigate('/home');
      this.appModel.setCurrentUser('');
      this.model.setCurrentRoute('/home');
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
      this.view.toggleShowBurgerMenu();
    });
  }
}
