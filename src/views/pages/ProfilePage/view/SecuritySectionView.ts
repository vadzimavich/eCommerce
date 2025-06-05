import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { elementCreator } from '../../../../utils/dom-helpers';
import * as formInputs from '../../../../utils/form-inputs';

export class SecuritySectionView {
  public mainChangePasswordButton!: HTMLButtonElement;
  public saveNewPasswordButton!: HTMLButtonElement;
  public cancelChangePasswordButton!: HTMLButtonElement;

  public currentPasswordInput!: HTMLInputElement;
  public newPasswordInput!: HTMLInputElement;
  public confirmPasswordInput!: HTMLInputElement;

  public currentPasswordViewButton!: HTMLButtonElement;
  public newPasswordViewButton!: HTMLButtonElement;
  public confirmPasswordViewButton!: HTMLButtonElement;
  private sectionElement: HTMLElement;
  private fieldsContainer!: HTMLElement;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.sectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'security-section' },
    });
    this.createStructure();
    this.model.subscribePasswordEditMode(() => this.toggleEditModeUI());
  }

  public render(): HTMLElement {
    this.toggleEditModeUI();
    return this.sectionElement;
  }

  public getSectionElement(): HTMLElement {
    return this.sectionElement;
  }

  private createStructure(): void {
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Security',
    });

    this.mainChangePasswordButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button'],
      content: 'Change Password',
      attributes: { id: 'change-password-main-btn' },
    });

    this.fieldsContainer = this.createChangePasswordFields();
    this.sectionElement.append(title, this.mainChangePasswordButton, this.fieldsContainer);
  }

  private createChangePasswordFields(): HTMLElement {
    const container = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__new-password-fields'],
    });

    this.currentPasswordInput = formInputs.createInputPassword('profile-current-password');
    this.currentPasswordInput.placeholder = 'Enter Current Password';
    this.currentPasswordViewButton = this.createPasswordViewButtonElement();
    container.append(
      this.createInputWrapper('Current Password:', this.currentPasswordInput, this.currentPasswordViewButton)
    );

    this.newPasswordInput = formInputs.createInputPassword('profile-new-password');
    this.newPasswordInput.placeholder = 'New Password';
    this.newPasswordViewButton = this.createPasswordViewButtonElement();
    container.append(this.createInputWrapper('New Password:', this.newPasswordInput, this.newPasswordViewButton));

    this.confirmPasswordInput = formInputs.createInputPassword('profile-confirm-password');
    this.confirmPasswordInput.placeholder = 'Confirm New Password';
    this.confirmPasswordViewButton = this.createPasswordViewButtonElement();
    container.append(
      this.createInputWrapper('Confirm New Password:', this.confirmPasswordInput, this.confirmPasswordViewButton)
    );

    const actionsBar = elementCreator(document.createElement('div'), { classNames: ['profile-page__actions-bar'] });
    this.saveNewPasswordButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--save'],
      content: 'Save New Password',
      attributes: { type: 'submit', id: 'save-new-password-btn', disabled: '' },
    });
    this.cancelChangePasswordButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--cancel'],
      content: 'Cancel',
      attributes: { type: 'button', id: 'cancel-change-password-btn' },
    });
    actionsBar.append(this.saveNewPasswordButton, this.cancelChangePasswordButton);
    container.append(actionsBar);

    return container;
  }

  private createPasswordViewButtonElement(): HTMLButtonElement {
    return elementCreator(document.createElement('button'), {
      classNames: ['password__button-view'],
      attributes: { type: 'button', 'aria-label': 'Show/hide password' },
    });
  }

  private toggleEditModeUI(): void {
    const isEditing = this.model.getIsPasswordEditModeActive();
    console.log('SecuritySectionView: toggleEditModeUI, isEditing:', isEditing);

    this.mainChangePasswordButton.style.display = isEditing ? 'none' : '';
    this.fieldsContainer.style.display = isEditing ? 'flex' : 'none';

    if (!isEditing) {
      [this.currentPasswordInput, this.newPasswordInput, this.confirmPasswordInput].forEach((input) => {
        if (input) {
          input.value = '';
          input.setAttribute('data-correct', 'false');
          input.type = 'password';
          const wrapper = input.closest('.form__input__wrapper');
          wrapper?.querySelector('.error-tooltip')?.remove();
          const viewButton = input.nextElementSibling;
          if (viewButton && viewButton.classList.contains('password__button-view')) {
            viewButton.classList.remove('view');
          }
        }
      });
    }
    if (this.saveNewPasswordButton) {
      this.saveNewPasswordButton.disabled = true;
    }
  }

  private createInputWrapper(
    labelContent: string,
    inputElement: HTMLInputElement,
    buttonView: HTMLButtonElement
  ): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['form__input__wrapper', 'profile-page__input-wrapper'],
    });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputElement.id },
      content: labelContent,
    });
    const requiredSpan = elementCreator(document.createElement('span'), {
      classNames: ['input_required'],
      content: '*',
    });
    label.append(requiredSpan);

    const fieldContainer = elementCreator(document.createElement('div'), { classNames: ['password__container'] });
    inputElement.classList.add('password-input-field');
    fieldContainer.append(inputElement, buttonView);
    wrapper.append(label, fieldContainer);

    return wrapper;
  }
}
