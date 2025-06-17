import { AppModel } from '../../../models/state/AppState';
import { AboutController } from './about-controller';
import { AboutModel } from './about-model';
import { AboutView } from './about-view';

export class AboutPage {
  private readonly view: AboutView;
  private readonly model: AboutModel;

  constructor(private readonly appModel: AppModel) {
    this.model = new AboutModel();
    this.view = new AboutView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new AboutController(this.appModel, this.model, this.view);
    return render;
  }
}
