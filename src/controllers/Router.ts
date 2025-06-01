import { AppModel } from '../models/state/AppState';
import { Main, RouteParameters, Routes } from '../models/types/router-types';

export class Router {
  constructor(
    private readonly routes: Routes,
    private readonly mainContainer: HTMLElement,
    private readonly appModel: AppModel
  ) {
    this.init();
  }

  public navigate(path: string): void {
    location.hash = `#${path}`;
  }

  private init(): void {
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

  private loadRoute(): void {
    const path = location.hash.slice(1) || '/';
    const { view, routeParameters } = this.checkRoute(path);
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
      this.mainContainer.replaceChildren(new view(this.appModel, routeParameters).render());
    }
  }

  private checkRoute(currentPath: string): {
    view: new (appModel: AppModel, routeParameters?: RouteParameters) => Main;
    routeParameters: RouteParameters;
  } {
    const currentParts = currentPath.split('/').filter((item) => item !== '');

    for (const route in this.routes) {
      const routeParts = route.split('/').filter((item) => item !== '');

      if (routeParts.length !== currentParts.length) continue;

      const parameters: RouteParameters = {};
      let matched = true;

      for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const currentPart = currentParts[i];

        // Если это параметр, сохраняем его
        if (routePart.startsWith(':')) {
          const parameterName = routePart.slice(1);
          parameters[parameterName] = currentPart;
        } else if (routePart !== currentPart) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return { view: this.routes[route], routeParameters: parameters };
      }
    }

    return { view: this.routes['/not-found'], routeParameters: {} };
  }
}
