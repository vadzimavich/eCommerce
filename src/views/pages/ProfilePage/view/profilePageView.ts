import { AppModel } from '../../../../models/state/AppState';
import { elementCreator } from '../../../../utils/dom-helpers';
import { ProfilePageModel } from '../profilePageModel';
import { PersonalInformationView } from './PersonalInformationView';
import { SecuritySectionView } from './SecuritySectionView';
// import { AddressesSectionView } from './AddressesSectionView';

export class ProfilePageView {
  private readonly container: HTMLElement;
  private readonly pageTitleElement: HTMLElement;
  private readonly contentWrapper: HTMLElement;

  private personalInfoView: PersonalInformationView;
  private securityView: SecuritySectionView;
  // private addressesView: AddressesSectionView;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['profile-page', 'page-wrapper'],
    });
    this.pageTitleElement = elementCreator(document.createElement('h1'), {
      classNames: ['profile-page__title', 'form__title'],
      content: 'My Profile',
    });
    this.contentWrapper = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__content-wrapper', 'section-item'],
    });
    this.container.append(this.pageTitleElement, this.contentWrapper);

    this.personalInfoView = new PersonalInformationView(this.model, this.appModel);
    this.securityView = new SecuritySectionView(this.model, this.appModel);
    // this.addressesView = new AddressesSectionView(this.model, this.appModel);
  }

  public render(): HTMLElement {
    console.log('ProfilePageView: render() called');
    this.contentWrapper.innerHTML = '';

    if (!this.appModel.getLoginState() || Object.keys(this.appModel.getCurrentUser()).length === 0) {
      this.contentWrapper.textContent = 'Loading user data or not logged in...';
    } else {
      this.contentWrapper.append(
        this.personalInfoView.render(),
        this.securityView.render()
        // this.addressesView.render()
      );
    }
    return this.container;
  }

  public getEditPersonalInfoButton(): HTMLButtonElement {
    return this.personalInfoView.editButton;
  }

  public getSavePersonalInfoButton(): HTMLButtonElement {
    return this.personalInfoView.saveButton;
  }

  public getCancelPersonalInfoButton(): HTMLButtonElement {
    return this.personalInfoView.cancelButton;
  }

  public getPersonalInfoFormInputs(): HTMLInputElement[] {
    return [
      this.personalInfoView.getFirstNameInput(),
      this.personalInfoView.getLastNameInput(),
      this.personalInfoView.getEmailInput(),
      this.personalInfoView.getDateOfBirthInput(),
    ].filter((input): input is HTMLInputElement => input !== null);
  }

  public getPersonalInfoFormValues(): {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  } | null {
    return this.personalInfoView.getFormValues();
  }

  public isPersonalInfoFormValid(): boolean {
    return this.personalInfoView.isFormValid();
  }

  public getMainChangePasswordButton(): HTMLButtonElement {
    return this.securityView.mainChangePasswordButton;
  }

  public getCurrentPasswordInput(): HTMLInputElement {
    return this.securityView.currentPasswordInput;
  }

  public getNewPasswordInput(): HTMLInputElement {
    return this.securityView.newPasswordInput;
  }

  public getConfirmPasswordInput(): HTMLInputElement {
    return this.securityView.confirmPasswordInput;
  }

  public getSaveNewPasswordButton(): HTMLButtonElement {
    return this.securityView.saveNewPasswordButton;
  }

  public getCancelChangePasswordButton(): HTMLButtonElement {
    return this.securityView.cancelChangePasswordButton;
  }

  public getCurrentPasswordViewButton(): HTMLButtonElement {
    return this.securityView.currentPasswordViewButton;
  }

  public getNewPasswordViewButton(): HTMLButtonElement {
    return this.securityView.newPasswordViewButton;
  }

  public getConfirmPasswordViewButton(): HTMLButtonElement {
    return this.securityView.confirmPasswordViewButton;
  }
}
