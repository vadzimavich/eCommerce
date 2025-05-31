import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import * as formInputs from '../../../utils/form-inputs';
import { ProfilePageModel } from './profilePageModel';
import type { Address } from '@commercetools/platform-sdk';

export class ProfilePageView {
  private readonly container: HTMLElement;
  private readonly pageTitleElement: HTMLElement;
  private readonly contentWrapper: HTMLElement;

  private editPersonalInfoButton!: HTMLButtonElement;
  private savePersonalInfoButton!: HTMLButtonElement;
  private cancelPersonalInfoButton!: HTMLButtonElement;
  private personalInfoSectionElement!: HTMLElement;
  private personalInfoFieldsContainer!: HTMLElement;
  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private dateOfBirthInput!: HTMLInputElement;

  private securitySectionElement!: HTMLElement;
  private mainChangePasswordButton!: HTMLButtonElement;
  private changePasswordFieldsContainer!: HTMLElement;
  private currentPasswordInput!: HTMLInputElement;
  private currentPasswordViewButton!: HTMLButtonElement;
  private newPasswordInput!: HTMLInputElement;
  private newPasswordViewButton!: HTMLButtonElement;
  private confirmPasswordInput!: HTMLInputElement;
  private confirmPasswordViewButton!: HTMLButtonElement;
  private saveNewPasswordButton!: HTMLButtonElement;
  private cancelChangePasswordButton!: HTMLButtonElement;

  private addressesSectionElement!: HTMLElement;

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

    this.createAllSectionsStructure();

    this.model.subscribePersonalInfoEdit(() => this.togglePersonalInfoEditModeUI());
    this.model.subscribePasswordEditMode(() => this.togglePasswordEditModeUI());
  }

  public render(): HTMLElement {
    this.contentWrapper.innerHTML = '';

    if (!this.appModel.getLoginState() || Object.keys(this.appModel.getCurrentUser()).length === 0) {
      this.contentWrapper.textContent = 'Loading user data or not logged in...';
    } else {
      this.togglePersonalInfoEditModeUI();
      this.togglePasswordEditModeUI();
      this.updateAddressesDOM();

      this.contentWrapper.append(
        this.personalInfoSectionElement,
        this.securitySectionElement,
        this.addressesSectionElement
      );
    }
    return this.container;
  }

  // getters simplified
  public getEditPersonalInfoButton(): HTMLButtonElement | null {
    return this.editPersonalInfoButton;
  }

  public getSavePersonalInfoButton(): HTMLButtonElement | null {
    return this.savePersonalInfoButton;
  }

  public getCancelPersonalInfoButton(): HTMLButtonElement | null {
    return this.cancelPersonalInfoButton;
  }

  public getPersonalInfoFormInputs(): HTMLInputElement[] {
    const inputsOrNulls = [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput];
    return inputsOrNulls.reduce<HTMLInputElement[]>((acc, input) => {
      if (input) {
        acc.push(input);
      }
      return acc;
    }, []);
  }

  public getPersonalInfoFormValues(): {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  } | null {
    if (
      !this.model.getIsEditingPersonalInfo() ||
      !this.firstNameInput ||
      !this.lastNameInput ||
      !this.emailInput ||
      !this.dateOfBirthInput
    )
      return null;
    return {
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      email: this.emailInput.value,
      dateOfBirth: this.dateOfBirthInput.value,
    };
  }

  public isPersonalInfoFormValid(): boolean {
    if (!this.model.getIsEditingPersonalInfo()) return false;
    const inputs = this.getPersonalInfoFormInputs();
    if (inputs.length < 4 && (this.firstNameInput || this.lastNameInput || this.emailInput || this.dateOfBirthInput)) {
      return false;
    }
    return inputs.every((input) => input.dataset.correct === 'true');
  }

  public getMainChangePasswordButton(): HTMLButtonElement | null {
    return this.mainChangePasswordButton;
  }

  public getCurrentPasswordInput(): HTMLInputElement | null {
    return this.currentPasswordInput;
  }

  public getNewPasswordInput(): HTMLInputElement | null {
    return this.newPasswordInput;
  }

  public getConfirmPasswordInput(): HTMLInputElement | null {
    return this.confirmPasswordInput;
  }

  public getSaveNewPasswordButton(): HTMLButtonElement | null {
    return this.saveNewPasswordButton;
  }

  public getCancelChangePasswordButton(): HTMLButtonElement | null {
    return this.cancelChangePasswordButton;
  }

  public getCurrentPasswordViewButton(): HTMLButtonElement | null {
    return this.currentPasswordViewButton;
  }

  public getNewPasswordViewButton(): HTMLButtonElement | null {
    return this.newPasswordViewButton;
  }

  public getConfirmPasswordViewButton(): HTMLButtonElement | null {
    return this.confirmPasswordViewButton;
  }

  private createAllSectionsStructure(): void {
    // personal info
    this.personalInfoSectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'personal-info-section' },
    });
    const piTitle = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Personal Information',
    });
    this.personalInfoFieldsContainer = this.createPersonalInfoFields();
    const piActionsBar = this.createPersonalInfoActionButtons();
    this.personalInfoSectionElement.append(piTitle, this.personalInfoFieldsContainer, piActionsBar);

    // security
    this.securitySectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'security-section' },
    });
    const secTitle = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Security',
    });
    this.mainChangePasswordButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button'],
      content: 'Change Password',
      attributes: { id: 'change-password-main-btn' },
    });
    this.changePasswordFieldsContainer = this.createChangePasswordFields();
    this.securitySectionElement.append(secTitle, this.mainChangePasswordButton, this.changePasswordFieldsContainer);

    // addresses
    this.addressesSectionElement = this.createAddressesDOM(); // Этот метод уже возвращает HTMLElement
  }

  // personal info
  private createPersonalInfoFields(): HTMLElement {
    const currentUser = this.appModel.getCurrentUser();
    const fieldsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__fields-container'],
    });
    this.firstNameInput = formInputs.createInputFirstName('profile-firstName');
    this.firstNameInput.value = currentUser.firstName || '';
    fieldsContainer.append(this.createInputWrapper('First Name:', this.firstNameInput));

    this.lastNameInput = formInputs.createInputLastName('profile-lastName');
    this.lastNameInput.value = currentUser.lastName || '';
    fieldsContainer.append(this.createInputWrapper('Last Name:', this.lastNameInput));

    this.emailInput = formInputs.createInputEmail('profile-email');
    this.emailInput.value = currentUser.email || '';
    fieldsContainer.append(this.createInputWrapper('Email:', this.emailInput));

    this.dateOfBirthInput = formInputs.createInputBirthday('profile-dateOfBirth');
    if (currentUser.dateOfBirth) this.dateOfBirthInput.value = currentUser.dateOfBirth;
    fieldsContainer.append(this.createInputWrapper('Date of Birth:', this.dateOfBirthInput));

    return fieldsContainer;
  }

  private createPersonalInfoActionButtons(): HTMLElement {
    const actionsBar = elementCreator(document.createElement('div'), { classNames: ['profile-page__actions-bar'] });
    this.editPersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button'],
      content: 'Edit Personal Info',
      attributes: { id: 'edit-personal-info-btn' },
    });
    this.savePersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--save'],
      content: 'Save Changes',
      attributes: { id: 'save-personal-info-btn' },
    });
    this.cancelPersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--cancel'],
      content: 'Cancel',
      attributes: { id: 'cancel-personal-info-btn' },
    });
    actionsBar.append(this.editPersonalInfoButton, this.savePersonalInfoButton, this.cancelPersonalInfoButton);
    return actionsBar;
  }

  private togglePersonalInfoEditModeUI(): void {
    const isEditing = this.model.getIsEditingPersonalInfo();
    const inputs = this.getPersonalInfoFormInputs();

    inputs.forEach((input) => {
      input.readOnly = !isEditing;
      input.classList.toggle('form__input--readonly', !isEditing);
      input.classList.toggle('form__input--editable', isEditing);

      if (!isEditing) {
        const currentUser = this.appModel.getCurrentUser();
        if (input.id === 'profile-firstName') input.value = currentUser.firstName || '';
        else if (input.id === 'profile-lastName') input.value = currentUser.lastName || '';
        else if (input.id === 'profile-email') input.value = currentUser.email || '';
        else if (input.id === 'profile-dateOfBirth') input.value = currentUser.dateOfBirth || '';

        input.setAttribute('data-correct', 'false');
        const wrapper = input.closest('.form__input__wrapper');
        wrapper?.querySelector('.error-tooltip')?.remove();
      }
      if (isEditing) input.dispatchEvent(new Event('input'));
    });

    if (this.editPersonalInfoButton) this.editPersonalInfoButton.classList.toggle('hidden', isEditing);
    if (this.savePersonalInfoButton) {
      this.savePersonalInfoButton.classList.toggle('hidden', !isEditing);
      if (isEditing) this.savePersonalInfoButton.disabled = !this.isPersonalInfoFormValid();
      else this.savePersonalInfoButton.disabled = true;
    }
    if (this.cancelPersonalInfoButton) this.cancelPersonalInfoButton.classList.toggle('hidden', !isEditing);
  }

  // security
  private createChangePasswordFields(): HTMLElement {
    const fieldsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__new-password-fields'],
    });
    this.currentPasswordInput = formInputs.createInputPassword('profile-current-password');
    this.currentPasswordInput.placeholder = 'Enter Current Password';
    this.currentPasswordViewButton = this.createPasswordViewButton();
    fieldsContainer.append(
      this.createInputWrapper('Current Password:', this.currentPasswordInput, this.currentPasswordViewButton)
    );

    this.newPasswordInput = formInputs.createInputPassword('profile-new-password');
    this.newPasswordInput.placeholder = 'New Password';
    this.newPasswordViewButton = this.createPasswordViewButton();
    fieldsContainer.append(this.createInputWrapper('New Password:', this.newPasswordInput, this.newPasswordViewButton));

    this.confirmPasswordInput = formInputs.createInputPassword('profile-confirm-password');
    this.confirmPasswordInput.placeholder = 'Confirm New Password';
    this.confirmPasswordViewButton = this.createPasswordViewButton();
    fieldsContainer.append(
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
    fieldsContainer.append(actionsBar);
    return fieldsContainer;
  }

  private togglePasswordEditModeUI(): void {
    const isEditing = this.model.getIsPasswordEditModeActive();
    console.log('View: togglePasswordEditModeUI, isEditing:', isEditing);

    if (this.mainChangePasswordButton) {
      this.mainChangePasswordButton.style.display = isEditing ? 'none' : ''; // '' или 'inline-block'/'block' в зависимости от того, как кнопка стилизована
    }
    if (this.changePasswordFieldsContainer) {
      // display: flex у этого контейнера в SCSS, поэтому при показе ставим 'flex'
      this.changePasswordFieldsContainer.style.display = isEditing ? 'flex' : 'none';
    }

    if (isEditing || !this.model.getIsPasswordEditModeActive()) {
      const passwordInputs = [this.currentPasswordInput, this.newPasswordInput, this.confirmPasswordInput];
      passwordInputs.forEach((input) => {
        if (input) {
          input.classList.add('form__input--editable');
          input.classList.remove('form__input--readonly');
        }
      });
    }

    if (this.saveNewPasswordButton) {
      if (isEditing) {
        this.saveNewPasswordButton.disabled = true;
      } else {
        this.saveNewPasswordButton.disabled = true;
      }
    }
  }

  private createPasswordViewButton(): HTMLButtonElement {
    return elementCreator(document.createElement('button'), {
      classNames: ['password__button-view'],
      attributes: { type: 'button', 'aria-label': 'Show/hide password' },
    });
  }

  private createInputWrapper(
    labelContent: string,
    inputElement: HTMLInputElement,
    buttonView?: HTMLButtonElement
  ): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['form__input__wrapper', 'profile-page__input-wrapper'],
    });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputElement.id },
      content: labelContent,
    });

    if (buttonView) {
      const fieldContainer = elementCreator(document.createElement('div'), { classNames: ['password__container'] });
      inputElement.classList.add('password-input-field');
      fieldContainer.append(inputElement, buttonView);
      wrapper.append(label, fieldContainer);
    } else {
      wrapper.append(label, inputElement);
    }
    return wrapper;
  }

  // addresses
  private updateAddressesDOM(): void {
    const newAddressesDOM = this.createAddressesDOM();
    if (this.addressesSectionElement && this.contentWrapper.contains(this.addressesSectionElement)) {
      this.addressesSectionElement.replaceWith(newAddressesDOM);
    }
    this.addressesSectionElement = newAddressesDOM;
  }

  private createAddressesDOM(): HTMLElement {
    const section = elementCreator(document.createElement('div'), { classNames: ['profile-page__section'] });
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'My Addresses',
    });
    section.append(title);
    const currentUser = this.appModel.getCurrentUser();
    const addresses = currentUser.addresses || [];
    if (addresses.length === 0) {
      section.append(
        elementCreator(document.createElement('p'), {
          classNames: ['profile-page__info-item'],
          content: 'You have no saved addresses yet.',
        })
      );
    } else {
      const addressList = elementCreator(document.createElement('div'), { classNames: ['profile-page__address-list'] });
      addresses.forEach((addr) =>
        addressList.append(
          this.createAddressCard(addr, currentUser.defaultShippingAddressId, currentUser.defaultBillingAddressId)
        )
      );
      section.append(addressList);
    }
    return section;
  }

  private getAddressDetailsHTML(address: Address): string[] {
    const details: string[] = [];
    if (address.firstName || address.lastName) {
      details.push(`<strong>Name:</strong> ${address.firstName || ''} ${address.lastName || ''}`);
    }
    details.push(`<strong>Street:</strong> ${address.streetName || ''} ${address.streetNumber || ''}`);
    details.push(`<strong>City:</strong> ${address.city || ''}`);
    details.push(`<strong>Postal Code:</strong> ${address.postalCode || ''}`);
    details.push(`<strong>Country:</strong> ${address.country || ''}`);
    return details;
  }

  private getDefaultAddressInfoText(
    addressId: string | undefined,
    defaultShippingId: string | undefined,
    defaultBillingId: string | undefined
  ): string {
    let infoText = '';
    if (addressId === defaultShippingId) {
      infoText += ' (Default Shipping)';
    }
    if (addressId === defaultBillingId) {
      infoText = infoText.includes('Shipping') ? ' (Default Shipping & Billing)' : ' (Default Billing)';
    }
    return infoText;
  }

  private createAddressCard(
    address: Address,
    defaultShippingId: string | undefined,
    defaultBillingId: string | undefined
  ): HTMLElement {
    const cardClasses = ['profile-page__address-card'];
    const defaultInfoText = this.getDefaultAddressInfoText(address.id, defaultShippingId, defaultBillingId);

    if (defaultInfoText.includes('Shipping')) cardClasses.push('profile-page__address-card--default-shipping');
    if (defaultInfoText.includes('Billing')) cardClasses.push('profile-page__address-card--default-billing');

    const card = elementCreator(document.createElement('div'), { classNames: cardClasses });

    if (defaultInfoText) {
      const defaultTextElement = elementCreator(document.createElement('span'), {
        classNames: ['default-address-text'],
        content: defaultInfoText,
      });
      const p = elementCreator(document.createElement('p'), { classNames: ['profile-page__address-item'] });
      p.append(defaultTextElement);
      card.append(p);
    }

    const addressDetailsHTML = this.getAddressDetailsHTML(address);
    addressDetailsHTML.forEach((detailHTML) => {
      const p = elementCreator(document.createElement('p'), { classNames: ['profile-page__address-item'] });
      p.innerHTML = detailHTML;
      card.append(p);
    });

    const actionsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-actions'],
    });
    card.append(actionsContainer);

    return card;
  }
}
