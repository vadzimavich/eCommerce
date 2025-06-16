import { AppModel } from '../../../models/state/AppState';
import { HomeController } from './homeController';
import { HomeModel } from './homeModel';
import { HomeView } from './homeView';
export class HomePage {
  private readonly view: HomeView;
  private readonly model: HomeModel;

  constructor(private readonly appModel: AppModel) {
    this.model = new HomeModel();
    this.view = new HomeView(this.appModel, this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new HomeController(this.appModel, this.model, this.view);
    return render;
  }
}
