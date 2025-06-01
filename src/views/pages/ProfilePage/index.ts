import { AppModel } from '../../../models/state/AppState';
import { ProfilePageController } from './profilePageController';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './view/profilePageView';

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
    console.log('ProfilePage/index.ts: render() called');
    const renderedElement = this.view.render();
    console.log('ProfilePage/index.ts: view.render() finished. Initializing controller listeners...');
    this.controller.initializePageListeners();
    return renderedElement;
  }
}
