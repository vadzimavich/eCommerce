import { AppModel } from '../../../../models/state/AppState';
import { elementCreator } from '../../../../utils/dom-helpers';
import { ProfilePageModel } from '../profilePageModel';
import { PersonalInformationView } from './PersonalInformationView';
import { SecuritySectionView } from './SecuritySectionView';
import { AddressesSectionView } from './AddressesSectionView';
import { loaderView } from '../../../components/Loader';

export class ProfilePageView {
  private readonly container: HTMLElement;
  private readonly pageTitleElement: HTMLElement;
  private readonly contentWrapper: HTMLElement;

  private personalInfoView: PersonalInformationView;
  private securityView: SecuritySectionView;
  private addressesView: AddressesSectionView;

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
    this.addressesView = new AddressesSectionView(this.model, this.appModel);
  }

  public render(): HTMLElement {
    this.contentWrapper.innerHTML = '';

    if (!this.appModel.getLoginState() || Object.keys(this.appModel.getCurrentUser()).length === 0) {
      this.contentWrapper.append(loaderView());
    } else {
      this.contentWrapper.replaceChildren();
      this.contentWrapper.append(
        this.personalInfoView.render(),
        this.securityView.render(),
        this.addressesView.render()
      );
    }
    return this.container;
  }

  public getPersonalInfoViewModule(): PersonalInformationView {
    return this.personalInfoView;
  }

  public getSecurityViewModule(): SecuritySectionView {
    return this.securityView;
  }

  public getAddressesSectionView(): AddressesSectionView {
    return this.addressesView;
  }
}
