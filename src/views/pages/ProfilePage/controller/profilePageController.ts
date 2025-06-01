import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { ProfilePageView } from '../view/profilePageView';
import { PersonalInfoController } from './PersonalInfoController';
import { SecurityController } from './SecurityController';
// import { AddressesController } from './controller/AddressesController';

export class ProfilePageController {
  private personalInfoController: PersonalInfoController;
  private securityController: SecurityController;
  // private addressesController: AddressesController;

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

    // this.addressesController = new AddressesController(
    //   this.model,
    //   this.view.getAddressesSectionView(),
    //   this.appModel
    // );

    this.appModel.subscribeLoginStateListener((): void => {
      console.log('ProfilePageController: Login state changed, main view will re-render if necessary.');
      this.view.render();
      this.initializePageListeners();
    });
  }

  public initializePageListeners(): void {
    console.log('ProfilePageController: Initializing ALL page listeners by delegating to sub-controllers.');
    this.personalInfoController.initializeListeners();
    this.securityController.initializeListeners();
    // this.addressesController.initializeListeners();
  }
}
