import { route } from '../../app';
import { AppModel } from '../../models/state/AppState';
import { HeaderView } from './headerView';

export class HeaderController {
  constructor(
    private readonly appModel: AppModel,
    private readonly view: HeaderView
  ) {
    this.addEventListeners();
    this.appModel.subscribeUsersListener(() => this.handleCurrentUserHead());
  }

  private addEventListeners(): void {
    this.handleNavigationClick();
    this.handleLogoClick();
  }

  private handleNavigationClick(): void {
    const navContainer = this.view.getNavContainer();
    navContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const rout = target.getAttribute('data-route');
        if (rout) {
          route.navigate(rout);
        }

        if (rout === '/login') {
          this.appModel.setCurrentUser('testUser');
        }

        if (rout === '/registration') {
          this.appModel.setCurrentUser('user was logouted');
        }
      }
    });
  }

  private handleLogoClick(): void {
    const logoContainer = this.view.getLogoContainer();
    logoContainer.addEventListener('click', () => route.navigate('/home'));
  }

  private handleCurrentUserHead(): void {
    this.view.updateCurrentUserHead();
  }
}
