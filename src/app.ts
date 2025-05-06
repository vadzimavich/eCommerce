import { AppModel } from './models/appModel';
import { Router } from './controllers/Router';
import { Header } from './components/header';

import type { Routes } from './models/types/router-types';
import { HomePage } from './views/pages/HomePage';
import { LoginPage } from './views/pages/LoginPage';

export class App {
  constructor() {
    const headerContainer = new Header().init();
    const mainContainer = document.createElement('main');
    document.body.append(headerContainer, mainContainer);

    const routes: Routes = {
      '/': HomePage,
      '/home': HomePage,
      '/login': LoginPage,
    };

    new Router(routes, mainContainer, new AppModel());
  }
}
