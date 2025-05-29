import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { formatDateOfBirth } from '../../../utils/formatters';
import { ProfilePageModel } from './profilePageModel';
import type { Address } from '@commercetools/platform-sdk';

export class ProfilePageView {
  private container: HTMLElement;
  private contentWrapper: HTMLElement;

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

  private renderPersonalInfo(): HTMLElement {
    const section = elementCreator(document.createElement('div'), { classNames: ['profile-page__section'] });
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Personal Information',
    });
    section.append(title);

    const currentUser = this.appModel.getCurrentUser();
    console.log('Current User for Profile Page:', JSON.stringify(currentUser, null, 2));

    const items = [
      { label: 'First Name:', value: currentUser.firstName || 'Not specified' },
      { label: 'Last Name:', value: currentUser.lastName || 'Not specified' },
      { label: 'Email:', value: currentUser.email || 'Not specified' },
      { label: 'Date of Birth:', value: formatDateOfBirth(currentUser.dateOfBirth) },
    ];

    items.forEach((item) => {
      const p = elementCreator(document.createElement('p'), { classNames: ['profile-page__info-item'] });
      const strong = elementCreator(document.createElement('strong'), { content: item.label });
      p.append(strong, document.createTextNode(item.value));
      section.append(p);
    });

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
}
