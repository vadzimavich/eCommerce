import { AppModel } from './models/state/AppState';
import { Router } from './controllers/Router';
import { Header } from './components/header';

import { HomePage } from './views/pages/HomePage';
import { LoginPage } from './views/pages/LoginPage';
import { AboutPage } from './views/pages/AboutUsPage';
import { RegistrationPage } from './views/pages/RegistrationPage';
import { CatalogPage } from './views/pages/CatalogPage';
import { NotFoundPage } from './views/pages/NotFoundPage';

import type { Routes } from './models/types/router-types';

class App {
  public readonly route: Router;

  constructor(private readonly appModel: AppModel) {
    const header = new Header(this.appModel);
    const headerContainer = header.init();

    const mainContainer = document.createElement('main');
    document.body.append(headerContainer, mainContainer);

    const routes: Routes = {
      '/': HomePage,
      '/home': HomePage,
      '/catalog': CatalogPage,
      '/about-us': AboutPage,
      '/sign-in': LoginPage,
      '/sign-up': RegistrationPage,
      '/not-found': NotFoundPage,
    };

    this.route = new Router(routes, mainContainer, appModel);
  }
}

const app = new App(new AppModel());
export const route = app.route;
