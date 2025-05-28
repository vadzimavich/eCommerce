import { AppModel } from '../../../models/state/AppState';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './profilePageView';

export class ProfilePageController {
  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: ProfilePageView,
    private readonly appModel: AppModel
  ) {
    console.log('ProfilePageController created', this.model, this.view, this.appModel);
  }
}
