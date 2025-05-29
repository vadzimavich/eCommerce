import { AppModel } from '../../../models/state/AppState';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './profilePageView';
import type { Customer } from '@commercetools/platform-sdk';

export class ProfilePageController {
  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: ProfilePageView,
    private readonly appModel: AppModel
  ) {
    this.appModel.subscribeLoginStateListener((): void => {
      console.log('Login state changed, re-rendering ProfilePage view and re-attaching ALL listeners.'); // debug log
      this.view.render();
      this.initializePageListeners();
    });

    this.model.subscribePersonalInfoEdit((): void => {
      console.log('Personal info edit mode changed, re-attaching personal info listeners.'); // debug log
      this.attachPersonalInfoActionListeners();
    });
  }

  public initializePageListeners(): void {
    console.log('ProfilePageController: Initializing ALL page listeners.'); // debug log
    this.attachPersonalInfoActionListeners();
    // there will be other attach...Listeners()
  }

  private attachPersonalInfoActionListeners(): void {
    console.log('Attaching/Re-attaching listeners for personal info actions...'); // debug log

    const editButton = this.view.getEditPersonalInfoButton();
    console.log('Edit button found for attaching:', editButton); // debug log
    if (editButton) {
      editButton.onclick = null;
      editButton.onclick = (): void => this.handleEditPersonalInfo();
    } else {
      console.warn('Edit Personal Info button NOT FOUND in DOM during attachPersonalInfoActionListeners.'); // debug log
    }

    const saveButton = this.view.getSavePersonalInfoButton();
    console.log('Save button found for attaching:', saveButton); // debug log
    if (saveButton) {
      saveButton.onclick = null;
      saveButton.onclick = (): void => this.handleSavePersonalInfo();
    } else {
      if (this.model.getIsEditingPersonalInfo()) {
        console.warn(
          'Save Personal Info button NOT FOUND in DOM (edit mode) during attachPersonalInfoActionListeners.'
        ); // debug log
      }
    }

    const cancelButton = this.view.getCancelPersonalInfoButton();
    console.log('Cancel button found for attaching:', cancelButton); // debug log
    if (cancelButton) {
      cancelButton.onclick = null;
      cancelButton.onclick = (): void => this.handleCancelEditPersonalInfo();
    } else {
      if (this.model.getIsEditingPersonalInfo()) {
        console.warn(
          'Cancel Personal Info button NOT FOUND in DOM (edit mode) during attachPersonalInfoActionListeners.'
        ); // debug log
      }
    }
  }

  private handleEditPersonalInfo(): void {
    console.log('Edit Personal Info button CLICKED'); // debug log
    this.model.setIsEditingPersonalInfo(true);
  }

  private processSavePersonalInfo(newValues: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }): void {
    const currentUser = this.appModel.getCurrentUser(); // currentUser = Partial<Customer>

    if (currentUser.id && typeof currentUser.version === 'number') {
      const updatedUserForAppModel: Customer = {
        id: currentUser.id,
        version: currentUser.version,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        email: newValues.email,
        addresses: currentUser.addresses || [],
        isEmailVerified: currentUser.isEmailVerified || false,
        shippingAddressIds: currentUser.shippingAddressIds || [],
        billingAddressIds: currentUser.billingAddressIds || [],
        key: currentUser.key,
        customerNumber: currentUser.customerNumber,
        externalId: currentUser.externalId,
        title: currentUser.title,
        salutation: currentUser.salutation,
        middleName: currentUser.middleName,
        companyName: currentUser.companyName,
        vatId: currentUser.vatId,
        locale: currentUser.locale,
        customerGroup: currentUser.customerGroup,
        authenticationMode: currentUser.authenticationMode || 'Password',
        stores: currentUser.stores || [],

        firstName: newValues.firstName,
        lastName: newValues.lastName,
        dateOfBirth: newValues.dateOfBirth,
      };
      this.appModel.setCurrentUser(updatedUserForAppModel);
    } else {
      console.error('Cannot update AppModel: current user data is incomplete (missing id or version).');
    }
  }

  private handleSavePersonalInfo(): void {
    if (!this.view.isPersonalInfoFormValid()) {
      console.error('Form is invalid. Cannot save.');
      alert('Form is invalid. Cannot save.');
      return;
    }
    const newValues = this.view.getPersonalInfoFormValues();
    if (newValues) {
      console.log('Saving personal info:', newValues);
      this.model.setIsEditingPersonalInfo(false);
      alert('Personal information updated (simulation).');

      this.processSavePersonalInfo(newValues);
    }
  }

  private handleCancelEditPersonalInfo(): void {
    this.model.setIsEditingPersonalInfo(false);
  }
}
