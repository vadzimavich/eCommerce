import { AppModel } from '../models/state/AppState';
import { Routes } from '../models/types/router-types';

export class Router {
  private routes: Routes;
  private readonly publicRoutes = ['/', '/home', '/catalog', '/about-us', '/sign-in', '/sign-up', '/not-found'];
  constructor(
    routes: Routes,
    private mainContainer: HTMLElement,
    private appModel: AppModel
  ) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.loadRoute());
    this.loadRoute();
  }

  public navigate(path: string): void {
    location.href = `#${path}`;
  }

  private loadRoute(): void {
    const path = location.hash.slice(1) || '/';
    const view = this.routes[path] || this.routes['/not-found'];
    const isPublic = this.publicRoutes.includes(path);
    const isAuthorized = this.appModel.getCurrentUser();

    if (!isPublic && !isAuthorized) {
      this.navigate('/home');
      return;
    }

    if (view) {
      this.mainContainer.replaceChildren(new view(this.appModel).render());
    }
  }
}
