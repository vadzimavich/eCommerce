import { AppModel } from './models/appModel';
import { Router } from './controllers/Router';
import { Header } from './components/header';

import type { Routes } from './models/types/router-types';
import { HomePage } from './views/pages/HomePage';
import { LoginPage } from './views/pages/LoginPage';
import { AboutPage } from './views/pages/AboutUsPage';
import { RegistrationPage } from './views/pages/RegistrationPage';
import { CatalogPage } from './views/pages/CatalogPage';
import { NotFoundPage } from './views/pages/NotFoundPage';

export class App {
  constructor() {
    const appModel = new AppModel();

    const header = new Header(appModel);
    const headerContainer = header.init();

    const mainContainer = document.createElement('main');
    document.body.append(headerContainer, mainContainer);

    const routes: Routes = {
      '/': HomePage,
      '/home': HomePage,
      '/about-us': AboutPage,
      '/registration': RegistrationPage,
      '/login': LoginPage,
      '/catalog': CatalogPage,
      '/not-found': NotFoundPage,
    };

    new Router(routes, mainContainer, appModel);
  }
}
