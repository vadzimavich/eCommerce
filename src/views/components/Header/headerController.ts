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
  }

  private handleNavigationClick(): void {
    const navContainer = this.view.getNavContainer();
    navContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        const rout = target.getAttribute('data-route');
        if (rout) {
          route.navigate(rout);
          this.model.setCurrentRoute(rout);
        }

        if (rout === '/sign-in') {
          this.appModel.setCurrentUser('testUser');
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
    const logoutContainer = this.view.getLogoutContainer();
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
}
