import { AppModel } from './models/appModel';
import { Router } from './controllers/Router';

import type { Routes } from './models/types/router-types';

export class App {
  constructor() {
    const mainContainer = document.createElement('main');
    document.body.append(mainContainer);

    const routes: Routes = {
      // '/': HomePage,
      // '/login': LoginPage,
    };

    new Router(routes, mainContainer, new AppModel());
  }
}
