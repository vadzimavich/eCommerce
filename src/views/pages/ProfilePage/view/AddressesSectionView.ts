import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { elementCreator } from '../../../../utils/dom-helpers';
import * as formInputs from '../../../../utils/form-inputs';
import { Address } from '@commercetools/platform-sdk';
import { countries as countryOptions } from '../../../components/InputField/constants-content';

export class AddressesSectionView {
  private sectionElement: HTMLElement;
  private addressListContainer!: HTMLElement;
  private addAddressButton!: HTMLButtonElement;
  private addressFormContainer!: HTMLElement;
  private streetInput!: HTMLInputElement;
  private cityInput!: HTMLInputElement;
  private postalCodeInput!: HTMLInputElement;
  private countrySelect!: HTMLSelectElement;
  private saveAddressButton!: HTMLButtonElement;
  private cancelAddressButton!: HTMLButtonElement;
  private currentEditingAddressId: string | null = null;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.sectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'addresses-section' },
    });
    this.createBaseStructure();
  }

  public render(): HTMLElement {
    this.displayAddresses();
    this.addressFormContainer.classList.add('hidden');
    this.currentEditingAddressId = null;
    return this.sectionElement;
  }

  public displayAddresses(): void {
    this.addressListContainer.innerHTML = '';
    const currentUser = this.appModel.getCurrentUser();
    const addresses = currentUser.addresses || [];
    if (addresses.length === 0) {
      this.addressListContainer.append(
        elementCreator(document.createElement('p'), {
          classNames: ['profile-page__info-item'],
          content: 'You have no saved addresses yet.',
        })
      );
    } else {
      addresses.forEach((addr) => {
        if (addr.id) {
          this.addressListContainer.append(
            this.createAddressCardElement(
              addr,
              currentUser.defaultShippingAddressId,
              currentUser.defaultBillingAddressId
            )
          );
        }
      });
    }
  }

  public showAddressForm(isEditMode: boolean, address?: Address): void {
    this.currentEditingAddressId = isEditMode && address ? address.id || null : null;
    this.addressFormContainer.classList.remove('hidden');
    this.saveAddressButton.textContent = isEditMode ? 'Save Changes' : 'Save New Address';
    if (isEditMode && address) {
      this.streetInput.value = address.streetName || '';
      this.cityInput.value = address.city || '';
      this.postalCodeInput.value = address.postalCode || '';
      this.countrySelect.value = address.country || '';
    } else {
      this.streetInput.value = '';
      this.cityInput.value = '';
      this.postalCodeInput.value = '';
      this.countrySelect.value = countryOptions[0];
    }
    [this.streetInput, this.cityInput, this.postalCodeInput, this.countrySelect].forEach((input) => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      if (input.tagName === 'SELECT') input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    this.updateSaveAddressButtonState();
  }

  public hideAddressForm(): void {
    this.addressFormContainer.classList.add('hidden');
    this.currentEditingAddressId = null;
  }

  public getAddressFormValues(): Omit<Address, 'id' | 'key' | 'firstName' | 'lastName'> | null {
    if (this.addressFormContainer.classList.contains('hidden')) return null;
    return {
      streetName: this.streetInput.value,
      city: this.cityInput.value,
      postalCode: this.postalCodeInput.value,
      country: this.countrySelect.value,
    };
  }

  public isAddressFormValid(): boolean {
    if (this.addressFormContainer.classList.contains('hidden')) return false;
    const inputsToValidate = [this.streetInput, this.cityInput, this.postalCodeInput, this.countrySelect];
    return inputsToValidate.every((input) => input.dataset.correct === 'true');
  }

  public updateSaveAddressButtonState(): void {
    this.saveAddressButton.disabled = !this.isAddressFormValid();
  }

  public getAddAddressButtonElement(): HTMLButtonElement {
    return this.addAddressButton;
  }

  public getAddressListContainerElement(): HTMLElement {
    return this.addressListContainer;
  }

  public getSaveAddressButtonElement(): HTMLButtonElement {
    return this.saveAddressButton;
  }

  public getCancelAddressButtonElement(): HTMLButtonElement {
    return this.cancelAddressButton;
  }

  public getCurrentEditingAddressId(): string | null {
    return this.currentEditingAddressId;
  }

  public getAddressFormInputs(): (HTMLInputElement | HTMLSelectElement)[] {
    return [this.streetInput, this.cityInput, this.postalCodeInput, this.countrySelect];
  }

  public getSectionElement(): HTMLElement {
    return this.sectionElement;
  }

  private createBaseStructure(): void {
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'My Addresses',
    });
    this.addressListContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-list'],
    });
    this.addAddressButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--add-address'],
      content: '+ Add New Address',
    });
    this.addressFormContainer = this.createAddressForm();
    this.addressFormContainer.classList.add('hidden');
    this.sectionElement.append(title, this.addressListContainer, this.addAddressButton, this.addressFormContainer);
  }

  private createAddressCardElement(
    address: Address,
    defaultShippingId: string | undefined,
    defaultBillingId: string | undefined
  ): HTMLElement {
    const card = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-card'],
      attributes: { 'data-address-id': address.id || '' },
    });

    const detailsContainer = this.createAddressDetailsContainer(address);
    const defaultControls = this.createAddressDefaultControls(address, defaultShippingId, defaultBillingId);
    const actionButtons = this.createAddressActionButtons(address.id || '');

    card.append(detailsContainer, defaultControls, actionButtons);
    return card;
  }

  private createAddressDetailsContainer(address: Address): HTMLElement {
    const container = elementCreator(document.createElement('div'), { classNames: ['profile-page__address-details'] });
    this.appendAddressDetails(container, address);
    return container;
  }

  private createAddressDefaultControls(
    address: Address,
    defaultShippingId: string | undefined,
    defaultBillingId: string | undefined
  ): HTMLElement {
    const controlsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-default-controls'],
    });
    controlsContainer.append(
      this.createDefaultAddressRadio(
        'shipping',
        address.id || 'temp-ship',
        address.id === defaultShippingId,
        'Set as default shipping'
      ),
      this.createDefaultAddressRadio(
        'billing',
        address.id || 'temp-bill',
        address.id === defaultBillingId,
        'Set as default billing'
      )
    );
    return controlsContainer;
  }

  private createAddressActionButtons(addressId: string): HTMLElement {
    const actionsContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-actions'],
    });
    const editButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button--edit-address'],
      content: 'Edit',
      attributes: { 'data-action': 'edit', 'data-address-id': addressId },
    });
    const deleteButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button--delete-address', 'button--cancel'],
      content: 'Delete',
      attributes: { 'data-action': 'delete', 'data-address-id': addressId },
    });
    actionsContainer.append(editButton, deleteButton);
    return actionsContainer;
  }

  private appendAddressDetails(container: HTMLElement, address: Address): void {
    container.innerHTML = '';
    const detailsMap = {
      Name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
      Street: `${address.streetName || ''} ${address.streetNumber || ''}`.trim(),
      City: address.city || '',
      'Postal Code': address.postalCode || '',
      Country: address.country || '',
    };
    Object.entries(detailsMap).forEach(([label, value]) => {
      if (value) {
        const p = elementCreator(document.createElement('p'), { classNames: ['profile-page__address-item'] });
        const strong = elementCreator(document.createElement('strong'), { content: `${label}: ` });
        p.append(strong, document.createTextNode(value));
        container.append(p);
      }
    });
  }

  private createDefaultAddressRadio(
    type: 'shipping' | 'billing',
    addressId: string,
    isChecked: boolean,
    labelText: string
  ): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['profile-page__radio-wrapper'] });
    const radioId = `default-${type}-${addressId}`;
    const radio = elementCreator(document.createElement('input'), {
      attributes: {
        type: 'radio',
        name: `default-${type}-address`,
        id: radioId,
        value: addressId,
        'data-address-id': addressId,
        'data-address-type': type,
      },
    });
    if (isChecked) {
      radio.checked = true;
    }
    const label = elementCreator(document.createElement('label'), { attributes: { for: radioId }, content: labelText });
    wrapper.append(radio, label);
    return wrapper;
  }

  private createAddressForm(): HTMLElement {
    const form = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-form', 'form'],
    });
    form.style.border = '1px solid #ccc';
    form.style.padding = '15px';
    form.style.marginTop = '15px'; // temp styles

    this.streetInput = formInputs.createInputStreet('profile-address-street');
    form.append(this.createFormInputWrapper('Street:', this.streetInput));
    this.cityInput = formInputs.createInputCity('profile-address-city');
    form.append(this.createFormInputWrapper('City:', this.cityInput));
    this.postalCodeInput = formInputs.createInputPostalCode('profile-address-postalCode');
    form.append(this.createFormInputWrapper('Postal Code:', this.postalCodeInput));
    this.countrySelect = formInputs.createSelectCountry('profile-address-country', countryOptions);
    form.append(this.createFormInputWrapper('Country:', this.countrySelect));

    const actionsBar = elementCreator(document.createElement('div'), { classNames: ['profile-page__actions-bar'] });
    this.saveAddressButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--save'],
      content: 'Save Address',
      attributes: { id: 'save-address-btn', disabled: '' },
    });
    this.cancelAddressButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--cancel'],
      content: 'Cancel',
      attributes: { id: 'cancel-address-btn' },
    });
    actionsBar.append(this.saveAddressButton, this.cancelAddressButton);
    form.append(actionsBar);
    return form;
  }

  private createFormInputWrapper(labelContent: string, inputElement: HTMLElement): HTMLElement {
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
    wrapper.append(label, inputElement);
    return wrapper;
  }
}
