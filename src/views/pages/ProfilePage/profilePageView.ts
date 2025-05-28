import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { ProfilePageModel } from './profilePageModel';

export class ProfilePageView {
  private container: HTMLElement;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['profile-page', 'page-wrapper'],
    });
    console.log('ProfilePageView created', this.model, this.appModel);
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';

    const title = elementCreator(document.createElement('h1'), {
      classNames: ['profile-page__title', 'form__title'],
      content: 'My Profile',
    });

    const contentWrapper = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__content-wrapper', 'section-item'],
    });

    contentWrapper.textContent = 'User profile information will be here...';

    this.container.append(title, contentWrapper);
    return this.container;
  }
}
