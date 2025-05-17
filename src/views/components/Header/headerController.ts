import { route } from '../../../app';
import { AppModel } from '../../../models/state/AppState';
import { HeaderView } from './headerView';

export class HeaderController {
  constructor(
    private readonly appModel: AppModel,
    private readonly view: HeaderView
  ) {
    this.addEventListeners();
    this.handleCurrentUserHead();
    this.appModel.subscribeUsersListener(() => this.handleCurrentUserHead());
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
        }

        if (rout === '/sign-in') {
          this.appModel.setCurrentUser('testUser');
        }
      }
    });
  }

  private handleLogoClick(): void {
    const logoContainer = this.view.getLogoContainer();
    logoContainer.addEventListener('click', () => route.navigate('/'));
  }

  private handleLogoutClick(): void {
    const logoutContainer = this.view.getLogoutContainer();
    logoutContainer.addEventListener('click', () => {
      route.navigate('/');
      this.appModel.setCurrentUser('');
    });
  }

  private handleCurrentUserHead(): void {
    this.view.updateCurrentUserState();
  }
}
