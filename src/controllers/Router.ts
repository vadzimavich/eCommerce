import { AppModel } from '../models/appModel';
import { Routes } from '../models/types/router-types';

export class Router {
  private routes: Routes;
  private readonly publicRoutes = ['/', '/home', '/login', '/registration', '/about-us', '/not-found'];
  constructor(
    routes: Routes,
    private mainContainer: HTMLElement,
    private appModel: AppModel
  ) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.loadRoute());
    this.loadRoute();
  }

  private loadRoute(): void {
    const path = location.hash.slice(1) || '/';
    const view = this.routes[path] || this.routes['/not-found'];
    const isPublic = this.publicRoutes.includes(path);
    const isAuthorized = this.appModel.getCurrentUser();

    if (!isPublic && !isAuthorized && this.routes.hasOwnProperty(path)) {
      location.hash = '/home';
      return;
    }

    if (view) {
      this.mainContainer.replaceChildren(new view(this.appModel).render());
    }
  }
}
