import { AppModel } from './models/state/AppState';
import { Router } from './controllers/Router';
import { HomePage } from './views/pages/HomePage';

import { LoginPage } from './views/pages/LoginPage';
import { AboutPage } from './views/pages/AboutUsPage';
import { RegistrationPage } from './views/pages/RegistrationPage';
import { CatalogPage } from './views/pages/CatalogPage';
import { CartPage } from './views/pages/BasketPage';

import type { Routes } from './models/types/router-types';
import { Header } from './views/components/Header';
import { NotFoundPage } from './views/pages/NotFoundPage';
import { HeaderModel } from './views/components/Header/headerModel';
import { ProfilePage } from './views/pages/ProfilePage';

class App {
  public readonly route: Router;

  constructor(
    private readonly appModel: AppModel,
    private readonly headerModel: HeaderModel
  ) {
    this.appModel.initUserFromSession();
    const header = new Header(this.appModel, this.headerModel);
    const headerContainer = header.render();

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
      '/cart': CartPage,
      '/my-account': ProfilePage,
    };

    this.route = new Router(routes, mainContainer, appModel);
  }
}

const app = new App(new AppModel(), new HeaderModel());
export const route = app.route;
