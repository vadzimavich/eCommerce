import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { elementCreator } from '../../../../utils/dom-helpers';
import * as formInputs from '../../../../utils/form-inputs';
import { Address } from '@commercetools/platform-sdk';
import { countries as countryOptions } from '../../../components/InputField/constants-content';
import { updateTooltip } from '../../../../utils/error-tooltip';

export class AddressesSectionView {
  private sectionElement: HTMLElement;
  private addressListContainer!: HTMLElement;
  private addAddressButton!: HTMLButtonElement;

  private addressFormContainer!: HTMLElement;
  private streetInput!: HTMLInputElement;
  private cityInput!: HTMLInputElement;
  private postalCodeInput!: HTMLInputElement;
  private countrySelect!: HTMLSelectElement;
  private defaultShippingCheckbox!: HTMLInputElement;
  private defaultBillingCheckbox!: HTMLInputElement;
  private saveAddressButton!: HTMLButtonElement;
  private cancelAddressButton!: HTMLButtonElement;
  private formValidationMessageElement!: HTMLElement;

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
    if (!this.currentEditingAddressId && this.addressFormContainer.parentElement) {
      this.addressFormContainer.style.display = 'none';
    }
    this.updateAddAddressButtonVisibility();
    return this.sectionElement;
  }

  public setCurrentEditingAddressId(addressId: string | null): void {
    this.currentEditingAddressId = addressId;
  }

  public displayAddresses(): void {
    this.addressListContainer.innerHTML = '';
    const currentUser = this.appModel.getCurrentUser();
    const addresses = currentUser.addresses || [];

    if (addresses.length === 0 && !this.currentEditingAddressId) {
      this.addressListContainer.append(
        elementCreator(document.createElement('p'), {
          classNames: ['profile-page__info-item'],
          content: 'You have no saved addresses yet.',
        })
      );
    } else {
      addresses.forEach((addr) => {
        if (addr.id) {
          if (addr.id === this.currentEditingAddressId) {
            this.addressListContainer.append(this.addressFormContainer);
            this.addressFormContainer.style.display = 'flex';
          } else {
            this.addressListContainer.append(
              this.createAddressCardElement(
                addr,
                currentUser.defaultShippingAddressId,
                currentUser.defaultBillingAddressId
              )
            );
          }
        }
      });
    }
    this.updateAddAddressButtonVisibility();
  }

  // eslint-disable-next-line max-lines-per-function
  public showAddressForm(isEditMode: boolean, address?: Address): void {
    const newEditingId = isEditMode && address ? address.id || null : null;
    this.setCurrentEditingAddressId(newEditingId);
    this.saveAddressButton.textContent = isEditMode ? 'Save Changes' : 'Save New Address';
    const currentUser = this.appModel.getCurrentUser();

    if (isEditMode && address) {
      this.streetInput.value = address.streetName || '';
      this.cityInput.value = address.city || '';
      this.postalCodeInput.value = address.postalCode || '';
      this.countrySelect.value = address.country || (countryOptions.length > 0 ? 'US' : '');
      this.defaultShippingCheckbox.checked = address.id === currentUser.defaultShippingAddressId;
      this.defaultBillingCheckbox.checked = address.id === currentUser.defaultBillingAddressId;
    } else {
      this.streetInput.value = '';
      this.cityInput.value = '';
      this.postalCodeInput.value = '';
      this.countrySelect.value = countryOptions.length > 0 ? 'US' : '';
      this.defaultShippingCheckbox.checked = false;
      this.defaultBillingCheckbox.checked = false;

      if (!isEditMode) {
        this.addressFormContainer.style.display = 'flex';
        this.addressListContainer.append(this.addressFormContainer);
      }
    }

    if (isEditMode) {
      this.displayAddresses();
    }

    [this.streetInput, this.cityInput, this.postalCodeInput, this.countrySelect].forEach((input) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      if (isEditMode && (input as HTMLInputElement | HTMLSelectElement).value) {
        input.setAttribute('data-correct', 'true');
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      } else if (!isEditMode && input.id === 'profile-address-country' && (input as HTMLSelectElement).value) {
        input.setAttribute('data-correct', 'true');
      } else {
        input.setAttribute('data-correct', 'false');
      }
      updateTooltip(input, { result: true });
    });
    this.updateSaveAddressButtonState();
    this.hideFormValidationMessage();
    this.updateAddAddressButtonVisibility();
  }

  public hideAddressForm(): void {
    this.setCurrentEditingAddressId(null);
    this.displayAddresses();
    this.hideFormValidationMessage();
  }

  public getAddressFormValues():
    | (Omit<Address, 'id' | 'key' | 'firstName' | 'lastName'> & {
        isDefaultShipping: boolean;
        isDefaultBilling: boolean;
      })
    | null {
    if (this.addressFormContainer.style.display === 'none') return null;
    return {
      streetName: this.streetInput.value,
      city: this.cityInput.value,
      postalCode: this.postalCodeInput.value,
      country: this.countrySelect.value,
      isDefaultShipping: this.defaultShippingCheckbox.checked,
      isDefaultBilling: this.defaultBillingCheckbox.checked,
    };
  }

  public isAddressFormValid(): boolean {
    if (this.addressFormContainer.style.display === 'none') return false;
    const inputsToValidate = [this.streetInput, this.cityInput, this.postalCodeInput, this.countrySelect];
    return inputsToValidate.every((input) => input.dataset.correct === 'true');
  }

  public updateSaveAddressButtonState(): void {
    this.saveAddressButton.disabled = !this.isAddressFormValid();
  }

  public showFormValidationMessage(message: string): void {
    this.formValidationMessageElement.textContent = message;
    this.formValidationMessageElement.style.display = 'flex';
  }

  public hideFormValidationMessage(): void {
    this.formValidationMessageElement.style.display = 'none';
    this.formValidationMessageElement.textContent = '';
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
    return [
      this.streetInput,
      this.cityInput,
      this.postalCodeInput,
      this.countrySelect,
      this.defaultShippingCheckbox,
      this.defaultBillingCheckbox,
    ];
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
    this.sectionElement.append(title, this.addressListContainer, this.addAddressButton);
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
    card.append(detailsContainer);

    const defaultStatusContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-default-status'],
    });
    if (address.id === defaultShippingId) {
      defaultStatusContainer.append(
        elementCreator(document.createElement('span'), {
          classNames: ['default-address-text', 'default-shipping-text'],
          content: 'Default Shipping Address',
        })
      );
    }
    if (address.id === defaultBillingId) {
      defaultStatusContainer.append(
        elementCreator(document.createElement('span'), {
          classNames: ['default-address-text', 'default-billing-text'],
          content: 'Default Billing Address',
        })
      );
    }
    if (defaultStatusContainer.hasChildNodes()) {
      card.append(defaultStatusContainer);
    }

    const actionButtons = this.createAddressActionButtons(address.id || '');
    card.append(actionButtons);
    return card;
  }

  private updateAddAddressButtonVisibility(): void {
    const isFormActiveForNew = this.addressFormContainer.style.display !== 'none' && !this.currentEditingAddressId;
    if (this.currentEditingAddressId || isFormActiveForNew) {
      this.addAddressButton.style.display = 'none';
    } else {
      this.addAddressButton.style.display = 'block';
    }
  }

  private createAddressDetailsContainer(address: Address): HTMLElement {
    const container = elementCreator(document.createElement('div'), { classNames: ['profile-page__address-details'] });
    this.appendAddressDetails(container, address);
    return container;
  }

  private appendAddressDetails(container: HTMLElement, address: Address): void {
    container.innerHTML = '';
    const countryName =
      countryOptions.find(
        (name) =>
          (name === 'USA' && address.country === 'US') ||
          (name === 'Canada' && address.country === 'CA') ||
          name === address.country
      ) || address.country;

    const detailsMap = {
      Street: `${address.streetName || ''} ${address.streetNumber || ''}`.trim(),
      City: address.city || '',
      'Postal Code': address.postalCode || '',
      Country: countryName,
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

  // eslint-disable-next-line max-lines-per-function
  private createAddressForm(): HTMLElement {
    const form = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__address-form', 'form'],
    });
    form.style.display = 'none';

    this.streetInput = formInputs.createInputStreet('profile-address-street');
    form.append(this.createFormInputWrapper('Street:', this.streetInput));

    this.cityInput = formInputs.createInputCity('profile-address-city');
    form.append(this.createFormInputWrapper('City:', this.cityInput));

    this.countrySelect = formInputs.createSelectCountry('profile-address-country', countryOptions);
    form.append(this.createFormInputWrapper('Country:', this.countrySelect));

    this.postalCodeInput = formInputs.createInputPostalCode('profile-address-postalCode');
    form.append(this.createFormInputWrapper('Postal Code:', this.postalCodeInput));

    const checkboxesContainer = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__form-checkboxes'],
    });
    checkboxesContainer.append(
      this.createDefaultAddressCheckboxWrapper(
        'shipping',
        'Set as default shipping address',
        'default-shipping-checkbox-input'
      ),
      this.createDefaultAddressCheckboxWrapper(
        'billing',
        'Set as default billing address',
        'default-billing-checkbox-input'
      )
    );
    form.append(checkboxesContainer);

    this.formValidationMessageElement = elementCreator(document.createElement('div'), {
      classNames: ['error-tooltip', 'profile-page__form-validation-message'],
    });
    this.formValidationMessageElement.style.display = 'none';
    form.append(this.formValidationMessageElement);

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

  private createDefaultAddressCheckboxWrapper(
    type: 'shipping' | 'billing',
    labelText: string,
    checkboxId: string
  ): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__checkbox-wrapper', 'form__checkboxes'],
    });
    const checkbox = elementCreator(document.createElement('input'), {
      attributes: { type: 'checkbox', id: checkboxId, 'data-default-type': type },
    });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: checkboxId },
      content: labelText,
    });
    wrapper.append(checkbox, label);

    if (type === 'shipping') {
      this.defaultShippingCheckbox = checkbox;
    } else {
      this.defaultBillingCheckbox = checkbox;
    }
    return wrapper;
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
