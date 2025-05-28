import { AppModel } from '../../../models/state/AppState';
import { ProfilePageController } from './profilePageController';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './profilePageView';

export class ProfilePage {
  private readonly view: ProfilePageView;
  private readonly model: ProfilePageModel;
  private readonly controller: ProfilePageController;

  constructor(private readonly appModel: AppModel) {
    this.model = new ProfilePageModel();
    this.view = new ProfilePageView(this.model, this.appModel);
    this.controller = new ProfilePageController(this.model, this.view, this.appModel);
  }

  public render(): HTMLElement {
    console.log('Rendering ProfilePage');
    return this.view.render();
  }
}
