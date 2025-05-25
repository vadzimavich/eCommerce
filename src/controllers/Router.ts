import { AppModel } from '../models/state/AppState';
import { Routes } from '../models/types/router-types';

export class Router {
  private routes: Routes;

  constructor(
    routes: Routes,
    private mainContainer: HTMLElement,
    private appModel: AppModel
  ) {
    this.routes = routes;

    const currentPath = location.hash.slice(1) || '/';
    this.appModel.setCurrentHash(currentPath);

    if (!location.hash) {
      this.navigate('/');
    } else {
      this.loadRoute();
    }

    window.addEventListener('hashchange', () => {
      const newPath = location.hash.slice(1);
      this.appModel.setCurrentHash(newPath);
      this.loadRoute();
    });
  }

  public navigate(path: string): void {
    location.hash = `#${path}`;
  }

  private loadRoute(): void {
    const path = location.hash.slice(1) || '/';
    const view = this.routes[path] || this.routes['/not-found'];
    const isAuthorized = this.appModel.getLoginState();

    if (!isAuthorized && path === '/my-account') {
      this.navigate('/sign-in');
      return;
    }

    if (isAuthorized && (path === '/sign-in' || path === '/sign-up')) {
      this.navigate('/home');
      return;
    }

    if (view) {
      this.mainContainer.replaceChildren(new view(this.appModel).render());
    }
  }
}
