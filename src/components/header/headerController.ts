import { route } from '../../app';
import { HeaderView } from './headerView';

export class HeaderController {
  constructor(private readonly view: HeaderView) {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    const navContainer = this.view.getNavContainer();
    navContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const rout = target.getAttribute('data-route');
        if (rout) {
          route.navigate(rout);
        }
      }
    });
  }
}
