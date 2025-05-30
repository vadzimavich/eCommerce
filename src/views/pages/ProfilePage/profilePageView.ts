import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
// import { formatDateOfBirth } from '../../../utils/formatters';
import * as formInputs from '../../../utils/form-inputs';
import { ProfilePageModel } from './profilePageModel';
import type { Address } from '@commercetools/platform-sdk';

export class ProfilePageView {
  private container: HTMLElement;
  private contentWrapper: HTMLElement;

  private editPersonalInfoButton!: HTMLButtonElement;
  private savePersonalInfoButton!: HTMLButtonElement;
  private cancelPersonalInfoButton!: HTMLButtonElement;

  private personalInfoSectionElement!: HTMLElement;
  private personalInfoFieldsContainer!: HTMLElement;

  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private dateOfBirthInput!: HTMLInputElement;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['profile-page', 'page-wrapper'],
    });
    this.contentWrapper = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__content-wrapper', 'section-item'],
    });

    this.model.subscribePersonalInfoEdit(() => this.togglePersonalInfoEditMode());
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.contentWrapper.innerHTML = '';

    const title = elementCreator(document.createElement('h1'), {
      classNames: ['profile-page__title', 'form__title'],
      content: 'My Profile',
    });

    if (!this.appModel.getLoginState() || Object.keys(this.appModel.getCurrentUser()).length === 0) {
      this.contentWrapper.textContent = 'Loading user data or not logged in...';
    } else {
      const personalInfoSection = this.renderPersonalInfo();
      const addressesSection = this.renderAddresses();
      this.contentWrapper.append(personalInfoSection, addressesSection);
    }

    this.container.append(title, this.contentWrapper);
    return this.container;
  }

  // button getters
  public getEditPersonalInfoButton(): HTMLButtonElement | null {
    if (this.editPersonalInfoButton && document.body.contains(this.editPersonalInfoButton)) {
      console.log('View GETTER: Returning this.editPersonalInfoButton:', this.editPersonalInfoButton);
      return this.editPersonalInfoButton;
    }
    console.log('View GETTER: this.editPersonalInfoButton is not set or not in DOM.');
    return null;
  }

  public getSavePersonalInfoButton(): HTMLButtonElement | null {
    if (this.savePersonalInfoButton && document.body.contains(this.savePersonalInfoButton)) {
      console.log('View GETTER: Returning this.savePersonalInfoButton:', this.savePersonalInfoButton);
      return this.savePersonalInfoButton;
    }
    console.log('View GETTER: this.savePersonalInfoButton is not set or not in DOM.');
    return null;
  }

  public getCancelPersonalInfoButton(): HTMLButtonElement | null {
    if (this.cancelPersonalInfoButton && document.body.contains(this.cancelPersonalInfoButton)) {
      console.log('View GETTER: Returning this.cancelPersonalInfoButton:', this.cancelPersonalInfoButton);
      return this.cancelPersonalInfoButton;
    }
    console.log('View GETTER: this.cancelPersonalInfoButton is not set or not in DOM.');
    return null;
  }

  // input getters
  public getPersonalInfoFormValues(): {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  } | null {
    if (!this.model.getIsEditingPersonalInfo()) return null;
    return {
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      email: this.emailInput.value,
      dateOfBirth: this.dateOfBirthInput.value,
    };
  }

  public getPersonalInfoFormInputs(): HTMLInputElement[] {
    if (this.firstNameInput && this.lastNameInput && this.emailInput && this.dateOfBirthInput) {
      return [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput];
    }
    return [];
  }

  public isPersonalInfoFormValid(): boolean {
    if (!this.model.getIsEditingPersonalInfo()) return false;
    return [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput].every(
      (input) => input.dataset.correct === 'true'
    );
  }

  private createPersonalInfoInputs(): void {
    const currentUser = this.appModel.getCurrentUser();
    this.personalInfoFieldsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__fields-container'],
    });

    this.firstNameInput = formInputs.createInputFirstName('profile-firstName');
    this.firstNameInput.value = currentUser.firstName || '';
    this.personalInfoFieldsContainer.append(this.createInputWrapper('First Name:', this.firstNameInput));

    this.lastNameInput = formInputs.createInputLastName('profile-lastName');
    this.lastNameInput.value = currentUser.lastName || '';
    this.personalInfoFieldsContainer.append(this.createInputWrapper('Last Name:', this.lastNameInput));

    this.emailInput = formInputs.createInputEmail('profile-email');
    this.emailInput.value = currentUser.email || '';
    this.personalInfoFieldsContainer.append(this.createInputWrapper('Email:', this.emailInput));

    this.dateOfBirthInput = formInputs.createInputBirthday('profile-dateOfBirth');
    if (currentUser.dateOfBirth) {
      this.dateOfBirthInput.value = currentUser.dateOfBirth;
    }
    this.personalInfoFieldsContainer.append(this.createInputWrapper('Date of Birth:', this.dateOfBirthInput));
  }

  private togglePersonalInfoEditMode(): void {
    const isEditing = this.model.getIsEditingPersonalInfo();
    const inputs = [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput];

    inputs.forEach((input) => {
      if (input) {
        input.readOnly = !isEditing;
        input.classList.toggle('form__input--readonly', !isEditing);
        input.classList.toggle('form__input--editable', isEditing);

        if (!isEditing) {
          const currentUser = this.appModel.getCurrentUser();
          if (input === this.firstNameInput) input.value = currentUser.firstName || '';
          if (input === this.lastNameInput) input.value = currentUser.lastName || '';
          if (input === this.emailInput) input.value = currentUser.email || '';
          if (input === this.dateOfBirthInput) input.value = currentUser.dateOfBirth || '';
        }

        if (isEditing) {
          input.dispatchEvent(new Event('input'));
        }
      }
    });

    if (this.editPersonalInfoButton) this.editPersonalInfoButton.classList.toggle('hidden', isEditing);
    if (this.savePersonalInfoButton) this.savePersonalInfoButton.classList.toggle('hidden', !isEditing);
    if (this.cancelPersonalInfoButton) this.cancelPersonalInfoButton.classList.toggle('hidden', !isEditing);

    if (isEditing && this.savePersonalInfoButton) {
      this.savePersonalInfoButton.disabled = !this.isPersonalInfoFormValid();
    }
  }

  private renderPersonalInfo(): HTMLElement {
    if (!this.personalInfoSectionElement || !document.body.contains(this.personalInfoSectionElement)) {
      this.personalInfoSectionElement = elementCreator(document.createElement('div'), {
        classNames: ['profile-page__section'],
        attributes: { id: 'personal-info-section' },
      });

      const title = elementCreator(document.createElement('h2'), {
        classNames: ['profile-page__section-title'],
        content: 'Personal Information',
      });
      this.personalInfoSectionElement.append(title);

      this.createPersonalInfoInputs();
      this.personalInfoSectionElement.append(this.personalInfoFieldsContainer);

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
      this.personalInfoSectionElement.append(actionsBar);
    }

    this.togglePersonalInfoEditMode();

    return this.personalInfoSectionElement;
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

  private renderAddresses(): HTMLElement {
    const section = elementCreator(document.createElement('div'), { classNames: ['profile-page__section'] });
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'My Addresses',
    });
    section.append(title);

    const currentUser = this.appModel.getCurrentUser();
    const addresses = currentUser.addresses || [];

    if (addresses.length === 0) {
      const noAddressesMessage = elementCreator(document.createElement('p'), {
        classNames: ['profile-page__info-item'],
        content: 'You have no saved addresses yet.',
      });
      section.append(noAddressesMessage);
      return section;
    }

    const addressList = elementCreator(document.createElement('div'), { classNames: ['profile-page__address-list'] });
    const defaultShippingId = currentUser.defaultShippingAddressId;
    const defaultBillingId = currentUser.defaultBillingAddressId;

    addresses.forEach((address: Address) => {
      const addressCard = this.createAddressCard(address, defaultShippingId, defaultBillingId);
      addressList.append(addressCard);
    });
    section.append(addressList);
    return section;
  }

  private createInputWrapper(labelContent: string, inputElement: HTMLInputElement): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['form__input__wrapper', 'profile-page__input-wrapper'],
    });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputElement.id },
      content: labelContent,
    });
    wrapper.append(label, inputElement);
    return wrapper;
  }
}
