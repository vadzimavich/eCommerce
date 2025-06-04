import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { AddressesSectionView } from '../view/AddressesSectionView';
import { CustomerService } from '../../../../models/services/AuthService';
import { REFRESH_TOKEN } from '../../../../controllers/AuthController';
import type { MyCustomerUpdateAction, Address, Customer } from '@commercetools/platform-sdk';
import * as handlerFields from '../../../../utils/handler-fields';
import { updateTooltip } from '../../../../utils/error-tooltip';

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
    const addAddressButton = this.view.getAddAddressButtonElement();
    addAddressButton.removeEventListener('click', this.handleAddAddressClick);
    addAddressButton.addEventListener('click', this.handleAddAddressClick);

    const cancelAddressButton = this.view.getCancelAddressButtonElement();
    cancelAddressButton.removeEventListener('click', this.handleCancelAddressForm);
    cancelAddressButton.addEventListener('click', this.handleCancelAddressForm);

    const saveAddressButton = this.view.getSaveAddressButtonElement();
    saveAddressButton.removeEventListener('click', this.handleSaveAddressClick);
    saveAddressButton.addEventListener('click', this.handleSaveAddressClick);

    this.view.getAddressFormInputs().forEach((input) => {
      const eventType = input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input';
      input.removeEventListener(eventType, this.handleAddressFormInputChange);
      input.addEventListener(eventType, this.handleAddressFormInputChange);
      if (input.type !== 'checkbox') {
        input.removeEventListener('blur', this.handleAddressFormInputBlur);
        input.addEventListener('blur', this.handleAddressFormInputBlur);
      }
    });

    const addressListContainer = this.view.getAddressListContainerElement();
    addressListContainer.removeEventListener('click', this.handleAddressListActions);
    addressListContainer.addEventListener('click', this.handleAddressListActions);
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
    let result: { result: boolean; errorMessage?: string } = { result: true };
    const { value, id } = inputElement;

    switch (id) {
      case 'profile-address-street':
        result = handlerFields.handlerRequiredField(value);
        break;
      case 'profile-address-city':
        result = handlerFields.handlerNameField(value);
        break;
      case 'profile-address-country':
        result = { result: !!value, errorMessage: !value ? 'Country is required.' : undefined };
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
    } else {
      updateTooltip(inputElement, { result: true });
    }
  }

  private handleAddAddressClick = (): void => {
    this.touchedFields.clear();
    this.view.showAddressForm(false);
  };

  private handleCancelAddressForm = (): void => {
    this.view.hideAddressForm();
    this.touchedFields.clear();
  };

  private handleAddressListActions = (event: Event): void => {
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
  };

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
    let currentUser = this.appModel.getCurrentUser();
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
      currentUser = this.appModel.getCurrentUser();
      const addressesExist = currentUser.addresses && currentUser.addresses.length > 0;
      if (addressesExist) {
        const pseudoAddressData = {
          isDefaultShipping: !!currentUser.defaultShippingAddressId,
          isDefaultBilling: !!currentUser.defaultBillingAddressId,
          streetName: '',
          city: '',
          postalCode: '',
          country: '',
        };
        if (!this.checkDefaultAddressRequirements(pseudoAddressData, currentUser, false, null)) {
        } else {
          this.view.hideFormValidationMessage();
        }
      } else {
        this.view.hideFormValidationMessage();
      }
    } else if (result instanceof Error) {
      this.customerService.modal.errorMessage(result.message);
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
    isEditing: boolean,
    editingId: string | null
  ): boolean {
    const addresses = currentUser.addresses || [];
    let hasDefaultShipping = false;
    let hasDefaultBilling = false;

    if (addressData.isDefaultShipping) hasDefaultShipping = true;
    if (addressData.isDefaultBilling) hasDefaultBilling = true;

    for (const addr of addresses) {
      if (addr.id === editingId) continue;
      if (addr.id === currentUser.defaultShippingAddressId) hasDefaultShipping = true;
      if (addr.id === currentUser.defaultBillingAddressId) hasDefaultBilling = true;
    }

    if (!isEditing && addresses.length === 0) {
      if (!addressData.isDefaultShipping || !addressData.isDefaultBilling) {
        this.view.showFormValidationMessage('The first address must be set as default for both shipping and billing.');
        return false;
      }
    } else if (addresses.length + (isEditing ? 0 : 1) > 0) {
      if (!hasDefaultShipping || !hasDefaultBilling) {
        const missing: string[] = [];
        if (!hasDefaultShipping) missing.push('shipping');
        if (!hasDefaultBilling) missing.push('billing');
        if (missing.length > 0) {
          this.view.showFormValidationMessage(
            `Please ensure at least one default ${missing.join(' and ')} address is set.`
          );
          return false;
        }
      }
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

  private findNewAddressId(customerBefore: Partial<Customer>, customerAfter: Customer): string | null {
    const oldAddressIds = new Set(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      customerBefore.addresses?.map((a) => a.id).filter((id) => id !== undefined) as string[]
    );
    const newAddress = customerAfter.addresses.find((a) => a.id && !oldAddressIds.has(a.id));
    return newAddress?.id || null;
  }

  private async prepareDefaultAddressActions(
    addressData: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    customerStateAfterMainAction: Customer,
    originalEditingId: string | null,
    customerStateBeforeAnyActions: Partial<Customer>
  ): Promise<MyCustomerUpdateAction[]> {
    const defaultActions: MyCustomerUpdateAction[] = [];
    let processedAddressId = originalEditingId;

    if (!processedAddressId) {
      processedAddressId = this.findNewAddressId(customerStateBeforeAnyActions, customerStateAfterMainAction);
    }

    if (!processedAddressId) {
      console.error('CRITICAL: Could not determine processed address ID for setting defaults.');
      return [];
    }

    const defaultShippingIdFromState = customerStateAfterMainAction.defaultShippingAddressId;
    const defaultBillingIdFromState = customerStateAfterMainAction.defaultBillingAddressId;

    if (addressData.isDefaultShipping) {
      if (defaultShippingIdFromState !== processedAddressId) {
        defaultActions.push({ action: 'setDefaultShippingAddress', addressId: processedAddressId });
      }
    } else if (defaultShippingIdFromState === processedAddressId) {
      defaultActions.push({ action: 'setDefaultShippingAddress', addressId: undefined });
    }

    if (addressData.isDefaultBilling) {
      if (defaultBillingIdFromState !== processedAddressId) {
        defaultActions.push({ action: 'setDefaultBillingAddress', addressId: processedAddressId });
      }
    } else if (defaultBillingIdFromState === processedAddressId) {
      defaultActions.push({ action: 'setDefaultBillingAddress', addressId: undefined });
    }
    console.log('Preparing default address actions:', JSON.stringify(defaultActions, null, 2));
    return defaultActions;
  }

  // eslint-disable-next-line max-lines-per-function
  private handleSaveAddressClick = async (): Promise<void> => {
    this.forceValidateAllFormFields();
    if (!this.view.isAddressFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the address form.');
      return;
    }

    const addressData = this.view.getAddressFormValues();
    const customerBeforeAnyActions = this.appModel.getCurrentUser();
    const initialVersion = customerBeforeAnyActions.version;

    if (!addressData || !customerBeforeAnyActions.id || typeof initialVersion !== 'number') {
      this.customerService.modal.errorMessage('Form data or user data is incomplete.');
      return;
    }

    const editingId = this.view.getCurrentEditingAddressId();
    if (!this.checkDefaultAddressRequirements(addressData, customerBeforeAnyActions, !!editingId, editingId)) {
      return;
    }

    this.view.getSaveAddressButtonElement().disabled = true;

    const mainActions = this.prepareAddressActions(addressData, editingId);
    let customerAfterMainSave = await this.customerService.updateCustomerPersonalInfo(initialVersion, mainActions);

    if (customerAfterMainSave instanceof Error) {
      this.customerService.modal.errorMessage(customerAfterMainSave.message);
      this.view.getSaveAddressButtonElement().disabled = false;
      if (customerAfterMainSave.message.includes('Concurrent modification')) {
        const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          const freshUserResponse = await this.customerService.loginWithRefreshToken(refreshToken);
          if (!(freshUserResponse instanceof Error)) {
            this.appModel.setCurrentUser(freshUserResponse);
          }
        }
      }
      return;
    }

    const defaultSettingActions = await this.prepareDefaultAddressActions(
      addressData,
      customerAfterMainSave,
      editingId,
      customerBeforeAnyActions
    );

    let finalCustomerState = customerAfterMainSave;
    if (defaultSettingActions.length > 0) {
      const defaultResult = await this.customerService.updateCustomerPersonalInfo(
        customerAfterMainSave.version,
        defaultSettingActions
      );
      if (defaultResult instanceof Error) {
        this.customerService.modal.errorMessage(
          `Address ${editingId ? 'updated' : 'added'}, but failed to set default status: ${defaultResult.message}`
        );
      } else {
        finalCustomerState = defaultResult;
      }
    }

    this.appModel.setCurrentUser(finalCustomerState);
    this.view.displayAddresses();
    this.view.hideAddressForm();

    if (
      !(customerAfterMainSave instanceof Error) &&
      (defaultSettingActions.length === 0 ||
        !(finalCustomerState instanceof Error && finalCustomerState !== customerAfterMainSave))
    ) {
      this.customerService.modal.infoMessage(`Address ${editingId ? 'updated' : 'added/modified'} successfully!`);
    }
    this.touchedFields.clear();
  };
}
