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
import { AuthController } from './controllers/AuthController';
import { ProductPage } from './views/pages/ProductDetailPage';
import { elementCreator } from './utils/dom-helpers';
import { Footer } from './views/components/Footer';

class App {
  public readonly route: Router;

  constructor(
    private readonly appModel: AppModel,
    private readonly headerModel: HeaderModel
  ) {
    this.appModel.initUserFromSession();
    const header = new Header(this.appModel, this.headerModel);
    const headerContainer = header.render();

    const footer = new Footer(this.appModel);
    const footerContainer = footer.render();

    const mainContainer = document.createElement('main');
    const background = elementCreator(document.createElement('div'), { classNames: ['texture'] });
    document.body.append(headerContainer, mainContainer, footerContainer, background);

    const routes: Routes = {
      '/': HomePage,
      '/home': HomePage,
      '/catalog/:category': CatalogPage,
      '/about-us': AboutPage,
      '/sign-in': LoginPage,
      '/sign-up': RegistrationPage,
      '/not-found': NotFoundPage,
      '/cart': CartPage,
      '/my-account': ProfilePage,
      '/product/:id': ProductPage,
    };

    this.route = new Router(routes, mainContainer, appModel);
    new AuthController(appModel).checkAuthorization();
  }
}

const app = new App(new AppModel(), new HeaderModel());
export const route = app.route;
