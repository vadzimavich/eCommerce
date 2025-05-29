import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { formatDateOfBirth } from '../../../utils/formatters';
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

    this.model.subscribePersonalInfoEdit(() => this.reRenderPersonalInfoSection());
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

  public isPersonalInfoFormValid(): boolean {
    if (!this.model.getIsEditingPersonalInfo()) return false;
    return [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput].every(
      (input) => input.dataset.correct === 'true'
    );
  }

  private renderPersonalInfo(): HTMLElement {
    this.personalInfoSectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'personal-info-section' },
    });
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Personal Information',
    });
    this.personalInfoSectionElement.append(title);

    if (this.model.getIsEditingPersonalInfo()) {
      this.renderPersonalInfoEditForm();
    } else {
      this.renderPersonalInfoDisplay();
    }
    return this.personalInfoSectionElement;
  }

  private renderPersonalInfoDisplay(): void {
    const currentUser = this.appModel.getCurrentUser();
    const items = [
      { label: 'First Name:', value: currentUser.firstName || 'Not specified', id: 'display-firstName' },
      { label: 'Last Name:', value: currentUser.lastName || 'Not specified', id: 'display-lastName' },
      { label: 'Email:', value: currentUser.email || 'Not specified', id: 'display-email' },
      {
        label: 'Date of Birth:',
        value: formatDateOfBirth(currentUser.dateOfBirth),
        id: 'display-dateOfBirth',
      },
    ];

    items.forEach((item) => {
      const p = elementCreator(document.createElement('p'), {
        classNames: ['profile-page__info-item'],
        attributes: { id: item.id },
      });
      const strong = elementCreator(document.createElement('strong'), { content: item.label });
      p.append(strong, document.createTextNode(item.value));
      this.personalInfoSectionElement.append(p);
    });

    this.editPersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button'],
      content: 'Edit Personal Info',
      attributes: { id: 'edit-personal-info-btn' },
    });

    this.personalInfoSectionElement.append(this.editPersonalInfoButton);

    const testButtonInDisplay = document.getElementById('edit-personal-info-btn');
    console.log('View: Test find #edit-personal-info-btn immediately after append:', testButtonInDisplay); // debug log
  }

  private renderPersonalInfoEditForm(): void {
    const currentUser = this.appModel.getCurrentUser();
    const formWrapper = elementCreator(document.createElement('div'), { classNames: ['profile-page__edit-form'] });

    this.firstNameInput = formInputs.createInputFirstName('profile-firstName');
    this.firstNameInput.value = currentUser.firstName || '';
    this.firstNameInput.dispatchEvent(new Event('input'));
    formWrapper.append(this.createInputWrapper('First Name:', this.firstNameInput));

    this.lastNameInput = formInputs.createInputLastName('profile-lastName');
    this.lastNameInput.value = currentUser.lastName || '';
    this.lastNameInput.dispatchEvent(new Event('input'));
    formWrapper.append(this.createInputWrapper('Last Name:', this.lastNameInput));

    this.emailInput = formInputs.createInputEmail('profile-email');
    this.emailInput.value = currentUser.email || '';
    this.emailInput.dispatchEvent(new Event('input'));
    formWrapper.append(this.createInputWrapper('Email:', this.emailInput));

    this.dateOfBirthInput = formInputs.createInputBirthday('profile-dateOfBirth');
    if (currentUser.dateOfBirth) {
      this.dateOfBirthInput.value = currentUser.dateOfBirth;
    }
    this.dateOfBirthInput.dispatchEvent(new Event('input'));
    formWrapper.append(this.createInputWrapper('Date of Birth:', this.dateOfBirthInput));

    this.personalInfoSectionElement.append(formWrapper);

    const actionsBar = elementCreator(document.createElement('div'), { classNames: ['profile-page__actions-bar'] });
    this.savePersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--save'],
      content: 'Save Changes',
    });
    this.cancelPersonalInfoButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--cancel'],
      content: 'Cancel',
    });

    actionsBar.append(this.savePersonalInfoButton, this.cancelPersonalInfoButton);
    this.personalInfoSectionElement.append(actionsBar);
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

  private reRenderPersonalInfoSection(): void {
    const sectionContainer = document.getElementById('personal-info-section');
    if (sectionContainer) {
      console.log('Re-rendering personal info section...'); // debug log
      const newSectionContent = this.renderPersonalInfo();
      sectionContainer.replaceWith(newSectionContent);
    } else {
      console.warn('#personal-info-section not found for re-render, doing full render.'); // debug log
      this.render();
    }
  }
}
