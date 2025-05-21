import { AppModel } from '../models/state/AppState';
import { Routes } from '../models/types/router-types';

export class Router {
  private routes: Routes;
  private readonly publicRoutes = [
    '/',
    '/home',
    '/catalog',
    '/about-us',
    '/sign-in',
    '/sign-up',
    '/cart',
    '/not-found',
  ];
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
    const isPublic = this.publicRoutes.includes(path);
    const isAuthorized = this.appModel.getCurrentUser();
    // тут проверка на проперти нужна так как этот
    if (!isPublic && !isAuthorized && this.routes.hasOwnProperty(path)) {
      if (path === '/my-account') {
        this.navigate('/sign-in');
      } else {
        this.navigate('/home');
      }

      return;
    }

    if (view) {
      this.mainContainer.replaceChildren(new view(this.appModel).render());
    }
  }
}
