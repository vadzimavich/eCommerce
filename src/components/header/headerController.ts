import { AppModel } from '../../models/appModel';
import { HeaderView } from './headerView';

export class HeaderController {
  constructor(
    private readonly appModel: AppModel,
    private readonly view: HeaderView
  ) {
    this.addEventListeners();
  }

  public navigate(route: string): void {
    this.appModel.setRoute(route);
  }

  private addEventListeners(): void {
    const navContainer = this.view.getNavContainer();
    navContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const route = target.getAttribute('data-route');
        if (route) {
          this.appModel.setRoute(route);
        }
      }
    });
  }
}
