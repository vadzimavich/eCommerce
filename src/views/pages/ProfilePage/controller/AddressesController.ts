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
  private initialAddressDataForEdit: Partial<
    Address & { isDefaultShipping?: boolean; isDefaultBilling?: boolean }
  > | null = null;

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
    this.initialAddressDataForEdit = null;
    this.view.showAddressForm(false);
  };

  private handleCancelAddressForm = (): void => {
    this.view.hideAddressForm();
    this.touchedFields.clear();
    this.initialAddressDataForEdit = null;
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
      this.initialAddressDataForEdit = {
        ...addressToEdit,
        isDefaultShipping: addressToEdit.id === currentUser.defaultShippingAddressId,
        isDefaultBilling: addressToEdit.id === currentUser.defaultBillingAddressId,
      };
      this.view.showAddressForm(true, addressToEdit);
      this.view.getAddressFormInputs().forEach((input) => {
        if (input.type !== 'checkbox') {
          this.validateAddressFormField(input);
        }
      });
      this.view.updateSaveAddressButtonState();
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

  // eslint-disable-next-line max-lines-per-function
  private checkDefaultAddressRequirements(
    addressDataFromForm: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    customerState: Partial<Customer>,
    isEditingFormForSpecificAddress: boolean,
    currentlyEditedAddressId: string | null
  ): boolean {
    const allAddresses = customerState.addresses || [];
    let willHaveDefaultShipping = false;
    let willHaveDefaultBilling = false;

    if (addressDataFromForm.isDefaultShipping) willHaveDefaultShipping = true;
    if (addressDataFromForm.isDefaultBilling) willHaveDefaultBilling = true;

    for (const addr of allAddresses) {
      if (isEditingFormForSpecificAddress && addr.id === currentlyEditedAddressId) continue;

      if (!willHaveDefaultShipping && addr.id === customerState.defaultShippingAddressId) {
        willHaveDefaultShipping = true;
      }
      if (!willHaveDefaultBilling && addr.id === customerState.defaultBillingAddressId) {
        willHaveDefaultBilling = true;
      }
    }

    let totalAddressesAfterOperation = allAddresses.length;
    if (!isEditingFormForSpecificAddress) {
      totalAddressesAfterOperation += 1;
    }

    if (totalAddressesAfterOperation === 0) {
      this.view.hideFormValidationMessage();
      return true;
    }

    if (totalAddressesAfterOperation === 1 && !isEditingFormForSpecificAddress) {
      if (!addressDataFromForm.isDefaultShipping || !addressDataFromForm.isDefaultBilling) {
        this.view.showFormValidationMessage('The first address must be set as default for both shipping and billing.');
        return false;
      }
    } else if (totalAddressesAfterOperation >= 1) {
      if (!willHaveDefaultShipping || !willHaveDefaultBilling) {
        const missing: string[] = [];
        if (!willHaveDefaultShipping) missing.push('shipping');
        if (!willHaveDefaultBilling) missing.push('billing');
        if (missing.length > 0) {
          this.view.showFormValidationMessage(
            `Please ensure at least one default ${missing.join(' and ')} address is set among all your addresses.`
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
    editingId: string | null,
    originalAddressForEdit?: Partial<Address>
  ): MyCustomerUpdateAction[] {
    const actions: MyCustomerUpdateAction[] = [];
    const addressPayload: Omit<Address, 'id' | 'key' | 'firstName' | 'lastName'> = {
      country: addressData.country,
      streetName: addressData.streetName,
      city: addressData.city,
      postalCode: addressData.postalCode,
    };

    if (editingId && originalAddressForEdit) {
      const hasDataChanged =
        addressPayload.country !== (originalAddressForEdit.country || '') ||
        addressPayload.streetName !== (originalAddressForEdit.streetName || '') ||
        addressPayload.city !== (originalAddressForEdit.city || '') ||
        addressPayload.postalCode !== (originalAddressForEdit.postalCode || '');
      if (hasDataChanged) {
        actions.push({ action: 'changeAddress', addressId: editingId, address: addressPayload });
      }
    } else if (!editingId) {
      actions.push({ action: 'addAddress', address: addressPayload });
    }
    return actions;
  }

  private findNewAddressId(customerBefore: Partial<Customer>, customerAfter: Customer): string | null {
    const oldAddressIds = new Set(
      customerBefore.addresses?.map((a) => a.id).filter((id): id is string => id !== undefined)
    );
    const newAddress = customerAfter.addresses.find((a) => a.id && !oldAddressIds.has(a.id));
    return newAddress?.id || null;
  }

  private async prepareDefaultAddressActions(
    addressDataFromForm: NonNullable<ReturnType<AddressesSectionView['getAddressFormValues']>>,
    customerStateAfterMainAction: Customer,
    originalEditingAddressId: string | null,
    customerStateBeforeAnyActions: Partial<Customer>
  ): Promise<MyCustomerUpdateAction[]> {
    const defaultActions: MyCustomerUpdateAction[] = [];
    let processedAddressId = originalEditingAddressId;

    if (!processedAddressId) {
      processedAddressId = this.findNewAddressId(customerStateBeforeAnyActions, customerStateAfterMainAction);
    }

    if (!processedAddressId) {
      console.error('CRITICAL: Could not determine processed address ID for setting defaults.');
      return [];
    }

    const defaultShippingIdInState = customerStateAfterMainAction.defaultShippingAddressId;
    const defaultBillingIdInState = customerStateAfterMainAction.defaultBillingAddressId;

    const originalWasDefaultShipping =
      this.initialAddressDataForEdit?.id === originalEditingAddressId &&
      this.initialAddressDataForEdit?.isDefaultShipping;
    const originalWasDefaultBilling =
      this.initialAddressDataForEdit?.id === originalEditingAddressId &&
      this.initialAddressDataForEdit?.isDefaultBilling;

    if (addressDataFromForm.isDefaultShipping) {
      if (defaultShippingIdInState !== processedAddressId) {
        defaultActions.push({ action: 'setDefaultShippingAddress', addressId: processedAddressId });
      }
    } else if (originalWasDefaultShipping || defaultShippingIdInState === processedAddressId) {
      defaultActions.push({ action: 'setDefaultShippingAddress', addressId: undefined });
    }

    if (addressDataFromForm.isDefaultBilling) {
      if (defaultBillingIdInState !== processedAddressId) {
        defaultActions.push({ action: 'setDefaultBillingAddress', addressId: processedAddressId });
      }
    } else if (originalWasDefaultBilling || defaultBillingIdInState === processedAddressId) {
      defaultActions.push({ action: 'setDefaultBillingAddress', addressId: undefined });
    }
    return defaultActions;
  }

  // eslint-disable-next-line max-lines-per-function
  private handleSaveAddressClick = async (): Promise<void> => {
    this.forceValidateAllFormFields();
    if (!this.view.isAddressFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the address form.');
      return;
    }

    const addressDataFromForm = this.view.getAddressFormValues();
    const customerBeforeSave = this.appModel.getCurrentUser();
    const initialVersion = customerBeforeSave.version;

    if (!addressDataFromForm || !customerBeforeSave.id || typeof initialVersion !== 'number') {
      this.customerService.modal.errorMessage('Form data or user data is incomplete.');
      return;
    }

    const editingId = this.view.getCurrentEditingAddressId();
    if (!this.checkDefaultAddressRequirements(addressDataFromForm, customerBeforeSave, !!editingId, editingId)) {
      return;
    }

    this.view.getSaveAddressButtonElement().disabled = true;
    let addressIsEdited = false;

    const mainActions = this.prepareAddressActions(
      addressDataFromForm,
      editingId,
      this.initialAddressDataForEdit || undefined
    );
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let customerAfterMainSave = customerBeforeSave as Customer;

    if (mainActions.length > 0) {
      addressIsEdited = true;
      const mainResult = await this.customerService.updateCustomerPersonalInfo(initialVersion, mainActions);
      if (mainResult instanceof Error) {
        this.customerService.modal.errorMessage(mainResult.message);
        this.view.getSaveAddressButtonElement().disabled = false;
        if (mainResult.message.includes('Concurrent modification')) {
          const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
          if (refreshToken) {
            const freshUser = await this.customerService.loginWithRefreshToken(refreshToken);
            if (!(freshUser instanceof Error)) this.appModel.setCurrentUser(freshUser);
          }
        }
        return;
      }
      customerAfterMainSave = mainResult;
    }

    const defaultSettingActions = await this.prepareDefaultAddressActions(
      addressDataFromForm,
      customerAfterMainSave,
      editingId,
      customerBeforeSave
    );

    let finalCustomerState = customerAfterMainSave;
    if (defaultSettingActions.length > 0) {
      addressIsEdited = true;
      const defaultResult = await this.customerService.updateCustomerPersonalInfo(
        customerAfterMainSave.version,
        defaultSettingActions
      );
      if (defaultResult instanceof Error) {
        this.customerService.modal.errorMessage(
          `Address data ${mainActions.length > 0 ? (editingId ? 'updated' : 'added') : 'not changed'}, but failed to set default status: ${defaultResult.message}`
        );
      } else {
        finalCustomerState = defaultResult;
      }
    }

    this.appModel.setCurrentUser(finalCustomerState);
    this.view.displayAddresses();
    this.view.hideAddressForm();
    this.touchedFields.clear();
    this.initialAddressDataForEdit = null;

    if (addressIsEdited) {
      if (
        !(
          finalCustomerState instanceof Error &&
          finalCustomerState !== customerAfterMainSave &&
          defaultSettingActions.length > 0
        )
      ) {
        this.customerService.modal.infoMessage(`Address ${editingId ? 'updated' : 'added/modified'} successfully!`);
      }
    } else {
      this.customerService.modal.infoMessage('No changes were made to the address.');
    }
  };
}
