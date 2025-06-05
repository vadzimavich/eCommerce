import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { ProfilePageView } from '../view/profilePageView';
import { PersonalInfoController } from './PersonalInfoController';
import { SecurityController } from './SecurityController';
import { AddressesController } from './AddressesController';

export class ProfilePageController {
  private personalInfoController: PersonalInfoController;
  private securityController: SecurityController;
  private addressesController: AddressesController;
  private listenersInitialized = false;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: ProfilePageView,
    private readonly appModel: AppModel
  ) {
    this.personalInfoController = new PersonalInfoController(
      this.model,
      this.view.getPersonalInfoViewModule(),
      this.appModel
    );
    this.securityController = new SecurityController(this.model, this.view.getSecurityViewModule(), this.appModel);
    this.addressesController = new AddressesController(this.model, this.view.getAddressesSectionView(), this.appModel);

    this.appModel.subscribeLoginStateListener((): void => {
      console.log('ProfilePageController: Login state changed, main view will re-render.');
      this.view.render();
      this.initializePageListeners();
    });
  }

  public initializePageListeners(): void {
    if (this.appModel.getCurrentRoute() !== '/my-account' && !this.appModel.getCurrentRoute().startsWith('/profile')) {
      console.log('ProfilePageController: Not on profile page, skipping listener initialization.');
      return;
    }

    if (!this.listenersInitialized) {
      console.log('ProfilePageController: Initializing sub-controller listeners (first time).');
      this.personalInfoController.initializeListeners();
      this.securityController.initializeListeners();
      this.addressesController.initializeListeners();
      this.listenersInitialized = true;
    } else {
      console.log('ProfilePageController: Sub-controller listeners already initialized.');
    }
  }
}
