// src/views/pages/ProfilePage/controller/AddressesController.ts

import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { AddressesSectionView } from '../view/AddressesSectionView';
import { CustomerService } from '../../../../models/services/AuthService';
import type { MyCustomerUpdateAction, Address, Customer } from '@commercetools/platform-sdk';
import * as handlerFields from '../../../../utils/handler-fields';
import { updateTooltip } from '../../../../utils/error-tooltip';
import { HandlerInputFieldResult } from '../../../../models/types/common-types';

export class AddressesController {
  private customerService: CustomerService;
  private touchedFields: Set<string> = new Set();

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: AddressesSectionView,
    private readonly appModel: AppModel
  ) {
    this.customerService = CustomerService.getInstance();
  }

  public initializeListeners(): void {
    this.view.getAddAddressButtonElement().addEventListener('click', () => this.handleAddAddressClick());
    this.view.getCancelAddressButtonElement().addEventListener('click', () => this.handleCancelAddressForm());
    this.view.getSaveAddressButtonElement().addEventListener('click', () => this.handleSaveAddressClick());

    this.view.getAddressFormInputs().forEach((input) => {
      const eventType = input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input';
      input.removeEventListener(eventType, this.handleAddressFormInputChange);
      input.addEventListener(eventType, this.handleAddressFormInputChange);

      if (input.type !== 'checkbox') {
        input.removeEventListener('blur', this.handleAddressFormInputBlur);
        input.addEventListener('blur', this.handleAddressFormInputBlur);
      }
    });

    this.view.getAddressListContainerElement().addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLButtonElement) {
        const action = target.dataset.action;
        const addressId = target.dataset.addressId;
        if (action === 'edit' && addressId) {
          this.handleEditAddressClick(addressId);
        } else if (action === 'delete' && addressId) {
          this.handleDeleteAddressClick(addressId);
        }
      }
    });
  }

  private handleAddressFormInputBlur = (event: Event): void => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLSelectElement) {
      if (!this.touchedFields.has(inputElement.id)) {
        this.touchedFields.add(inputElement.id);
        this.validateAddressFormField(inputElement);
      }
    }
  };

  private handleAddressFormInputChange = (event: Event): void => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLSelectElement) {
      if (this.touchedFields.has(inputElement.id) || inputElement.type === 'checkbox') {
        this.validateAddressFormField(inputElement);
      }
      this.view.updateSaveAddressButtonState();
    }
  };

  private validateAddressFormField(inputElement: HTMLInputElement | HTMLSelectElement): void {
    let result: HandlerInputFieldResult = { result: true };
    const { value, id } = inputElement;

    switch (id) {
      case 'profile-address-street':
        result = handlerFields.handlerRequiredField(value);
        break;
      case 'profile-address-city':
        result = handlerFields.handlerNameField(value);
        break;
      case 'profile-address-country':
        result = { result: !!value };
        break;
      case 'profile-address-postalCode':
        {
          const formContainer = inputElement.closest('.profile-page__address-form');
          const countrySelect = formContainer?.querySelector<HTMLSelectElement>('#profile-address-country');
          const countryCode = countrySelect ? countrySelect.value : '';
          result = handlerFields.handlerPostalCodeField(countryCode, value);
        }
        break;
      case 'default-shipping-checkbox-input':
      case 'default-billing-checkbox-input':
        inputElement.setAttribute('data-correct', 'true');
        this.view.updateSaveAddressButtonState();
        return;
    }
    inputElement.setAttribute('data-correct', result.result.toString());
    if (this.touchedFields.has(id) || !result.result) {
      updateTooltip(inputElement, result);
    }
  }

  private handleAddAddressClick(): void {
    this.touchedFields.clear();
    this.view.showAddressForm(false);
  }

  private handleCancelAddressForm(): void {
    this.view.hideAddressForm();
    this.touchedFields.clear();
  }

  private handleEditAddressClick(addressId: string): void {
    this.touchedFields.clear();
    const currentUser = this.appModel.getCurrentUser();
    const addressToEdit = currentUser.addresses?.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      this.view.showAddressForm(true, addressToEdit);
    } else {
      this.customerService.modal.errorMessage('Could not find address to edit.');
    }
  }

  private async handleDeleteAddressClick(addressId: string): Promise<void> {
    const currentUser = this.appModel.getCurrentUser();
    if (!currentUser.id || typeof currentUser.version !== 'number') {
      this.customerService.modal.errorMessage('Cannot delete address: user data is incomplete.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this address?');
    if (!confirmed) return;

    const actions: MyCustomerUpdateAction[] = [{ action: 'removeAddress', addressId }];
    const result = await this.customerService.updateCustomerPersonalInfo(currentUser.version, actions);

    if (result && !(result instanceof Error)) {
      this.appModel.setCurrentUser(result);
      this.view.displayAddresses();
      this.customerService.modal.infoMessage('Address deleted successfully!');
    } else {
      // ошибка уже обработана в CustomerService
    }
  }

  private forceValidateAllFormFields(): void {
    this.view.getAddressFormInputs().forEach((input) => {
      if (input.type !== 'checkbox') {
        this.touchedFields.add(input.id);
        this.validateAddressFormField(input);
      } else {
        input.setAttribute('data-correct', 'true');
      }
    });
  }

  private checkDefaultAddressRequirements(
    addressData: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    currentUser: Partial<Customer>,
    isEditing: boolean
  ): boolean {
    const totalAddresses = currentUser.addresses?.length || 0;
    let hasDefaultShipping = addressData.isDefaultShipping;
    let hasDefaultBilling = addressData.isDefaultBilling;

    if (!(!isEditing && totalAddresses === 0) && !(isEditing && totalAddresses === 1)) {
      currentUser.addresses?.forEach((addr) => {
        if (isEditing && this.view.getCurrentEditingAddressId() === addr.id) return;

        if (addr.id === currentUser.defaultShippingAddressId) hasDefaultShipping = true;
        if (addr.id === currentUser.defaultBillingAddressId) hasDefaultBilling = true;
      });
    }

    if (!isEditing && totalAddresses === 0) {
    } else if (isEditing) {
      if (addressData.isDefaultShipping) hasDefaultShipping = true;
      if (addressData.isDefaultBilling) hasDefaultBilling = true;
    }

    if (!hasDefaultShipping || !hasDefaultBilling) {
      const missing: string[] = [];
      if (!hasDefaultShipping) missing.push('shipping');
      if (!hasDefaultBilling) missing.push('billing');
      this.view.showFormValidationMessage(
        `Please ensure at least one default ${missing.join(' and ')} address is set among all your addresses.`
      );
      return false;
    }
    this.view.hideFormValidationMessage();
    return true;
  }

  private prepareAddressActions(
    addressData: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    editingId: string | null
  ): MyCustomerUpdateAction[] {
    const actions: MyCustomerUpdateAction[] = [];
    const addressPayload: Omit<Address, 'id' | 'key' | 'firstName' | 'lastName'> = {
      country: addressData.country,
      streetName: addressData.streetName,
      city: addressData.city,
      postalCode: addressData.postalCode,
    };

    if (editingId) {
      actions.push({ action: 'changeAddress', addressId: editingId, address: addressPayload });
    } else {
      actions.push({ action: 'addAddress', address: addressPayload });
    }
    return actions;
  }

  private async prepareDefaultAddressActions(
    addressData: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    customerAfterSave: Customer,
    originalEditingId: string | null
  ): Promise<MyCustomerUpdateAction[]> {
    const defaultActions: MyCustomerUpdateAction[] = [];
    const savedAddressId =
      originalEditingId ||
      customerAfterSave.addresses.find(
        (addr) =>
          addr.streetName === addressData.streetName &&
          addr.city === addressData.city &&
          addr.postalCode === addressData.postalCode &&
          addr.country === addressData.country
      )?.id;

    if (!savedAddressId) {
      console.error('Could not determine saved address ID for setting defaults.');
      return [];
    }

    const currentDefaultShippingId = customerAfterSave.defaultShippingAddressId;
    const currentDefaultBillingId = customerAfterSave.defaultBillingAddressId;

    if (addressData.isDefaultShipping && currentDefaultShippingId !== savedAddressId) {
      defaultActions.push({ action: 'setDefaultShippingAddress', addressId: savedAddressId });
    } else if (!addressData.isDefaultShipping && currentDefaultShippingId === savedAddressId) {
      defaultActions.push({ action: 'setDefaultShippingAddress', addressId: undefined });
    }

    if (addressData.isDefaultBilling && currentDefaultBillingId !== savedAddressId) {
      defaultActions.push({ action: 'setDefaultBillingAddress', addressId: savedAddressId });
    } else if (!addressData.isDefaultBilling && currentDefaultBillingId === savedAddressId) {
      defaultActions.push({ action: 'setDefaultBillingAddress', addressId: undefined });
    }
    return defaultActions;
  }

  // eslint-disable-next-line max-lines-per-function
  private async handleSaveAddressClick(): Promise<void> {
    this.forceValidateAllFormFields();
    if (!this.view.isAddressFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the address form.');
      return;
    }
    const addressData = this.view.getAddressFormValues();
    const currentUser = this.appModel.getCurrentUser();
    if (!addressData || !currentUser.id || typeof currentUser.version !== 'number') {
      this.customerService.modal.errorMessage('Form data or user data is incomplete.');
      return;
    }
    const editingId = this.view.getCurrentEditingAddressId();
    if (!this.checkDefaultAddressRequirements(addressData, currentUser, !!editingId)) {
      return;
    }
    this.view.getSaveAddressButtonElement().disabled = true;
    const mainActions = this.prepareAddressActions(addressData, editingId);
    let result = await this.customerService.updateCustomerPersonalInfo(currentUser.version, mainActions);
    if (result && !(result instanceof Error)) {
      let customerAfterMainActions = result;
      const defaultSettingActions = await this.prepareDefaultAddressActions(
        addressData,
        customerAfterMainActions,
        editingId
      );
      if (defaultSettingActions.length > 0) {
        const defaultResult = await this.customerService.updateCustomerPersonalInfo(
          customerAfterMainActions.version,
          defaultSettingActions
        );
        if (defaultResult && !(defaultResult instanceof Error)) {
          customerAfterMainActions = defaultResult;
        } else {
          this.customerService.modal.errorMessage('Address saved, but failed to update default status.');
        }
      }
      this.appModel.setCurrentUser(customerAfterMainActions);
      this.view.displayAddresses();
      this.view.hideAddressForm();
      this.customerService.modal.infoMessage(`Address ${editingId ? 'updated' : 'added'} successfully!`);
      this.touchedFields.clear();
    } else {
      this.view.getSaveAddressButtonElement().disabled = false;
    }
  }
}
