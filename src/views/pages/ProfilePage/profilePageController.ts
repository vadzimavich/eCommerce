import { AppModel } from '../../../models/state/AppState';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './profilePageView';
import type { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { CustomerService } from '../../../models/services/AuthService';

export class ProfilePageController {
  private customerService: CustomerService;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: ProfilePageView,
    private readonly appModel: AppModel
  ) {
    this.customerService = CustomerService.getInstance();

    this.appModel.subscribeLoginStateListener((): void => {
      console.log('Login state changed, re-rendering ProfilePage view and re-attaching ALL listeners.'); // debug log
      this.view.render();
      this.initializePageListeners();
    });

    this.model.subscribePersonalInfoEdit((): void => {
      console.log('Personal info edit mode changed in model. Updating save button state.'); // debug log
      this.updateSaveButtonState();
    });
  }

  public initializePageListeners(): void {
    console.log('ProfilePageController: Initializing ALL page listeners.'); // debug log
    this.attachStaticButtonListeners();
    this.attachPersonalInfoInputListeners();
  }

  private attachStaticButtonListeners(): void {
    console.log('Attaching listeners for static profile buttons (Edit, Save, Cancel)...'); // debug log

    const editButton = this.view.getEditPersonalInfoButton();
    if (editButton) {
      editButton.onclick = (): void => this.handleEditPersonalInfo();
    } else {
      console.warn('Edit Personal Info button NOT FOUND during initial listener attachment.'); // debug log
    }

    const saveButton = this.view.getSavePersonalInfoButton();
    if (saveButton) {
      saveButton.onclick = null;
      saveButton.onclick = (): void => {
        this.handleSavePersonalInfo();
      };
    } else {
      console.warn('Save Personal Info button NOT FOUND during initial listener attachment.'); // debug log
    }

    const cancelButton = this.view.getCancelPersonalInfoButton();
    if (cancelButton) {
      cancelButton.onclick = (): void => this.handleCancelEditPersonalInfo();
    } else {
      console.warn('Cancel Personal Info button NOT FOUND during initial listener attachment.'); // debug log
    }
  }

  private attachPersonalInfoInputListeners(): void {
    console.log('Attaching input listeners for personal info fields...');
    const inputs = this.view.getPersonalInfoFormInputs();
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.removeEventListener('input', this.updateSaveButtonState);
        input.addEventListener('input', this.updateSaveButtonState);
      });
    } else {
      console.warn('Personal info input fields NOT FOUND for attaching input listeners.');
    }
  }

  private updateSaveButtonState = (): void => {
    const saveButton = this.view.getSavePersonalInfoButton();
    if (saveButton && this.model.getIsEditingPersonalInfo()) {
      saveButton.disabled = !this.view.isPersonalInfoFormValid();
    }
  };

  private handleEditPersonalInfo(): void {
    console.log('Edit Personal Info button CLICKED');
    this.model.setIsEditingPersonalInfo(true);
  }

  private createUpdateActions(
    newValues: { firstName: string; lastName: string; email: string; dateOfBirth: string },
    currentUser: Partial<Customer>
  ): MyCustomerUpdateAction[] {
    const actions: MyCustomerUpdateAction[] = [];
    if (newValues.firstName !== (currentUser.firstName || '')) {
      actions.push({ action: 'setFirstName', firstName: newValues.firstName });
    }
    if (newValues.lastName !== (currentUser.lastName || '')) {
      actions.push({ action: 'setLastName', lastName: newValues.lastName });
    }
    if (newValues.email !== (currentUser.email || '')) {
      actions.push({ action: 'changeEmail', email: newValues.email });
    }
    if (newValues.dateOfBirth && newValues.dateOfBirth !== (currentUser.dateOfBirth || '')) {
      actions.push({ action: 'setDateOfBirth', dateOfBirth: newValues.dateOfBirth });
    } else if (!newValues.dateOfBirth && currentUser.dateOfBirth) {
      console.warn('Date of birth cleared, not sending update action for it.');
    }
    return actions;
  }

  private async handleSavePersonalInfo(): Promise<void> {
    if (!this.view.isPersonalInfoFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the form.');
      return;
    }
    const newValues = this.view.getPersonalInfoFormValues();
    const currentUser = this.appModel.getCurrentUser();

    if (!newValues || !currentUser.id || typeof currentUser.version !== 'number') {
      this.customerService.modal.errorMessage('User data is incomplete or form values are missing.');
      return;
    }

    const actions = this.createUpdateActions(newValues, currentUser);

    if (actions.length === 0) {
      this.customerService.modal.infoMessage('No changes detected.');
      this.model.setIsEditingPersonalInfo(false);
      return;
    }

    const saveButton = this.view.getSavePersonalInfoButton();
    if (saveButton) saveButton.disabled = true;

    console.log('Attempting to update customer with version:', currentUser.version, 'and actions:', actions);
    const result = await this.customerService.updateCustomerPersonalInfo(currentUser.version, actions);

    if (saveButton) saveButton.disabled = !this.view.isPersonalInfoFormValid();

    if (result && !(result instanceof Error)) {
      console.log('Customer updated successfully by API:', result);
      this.appModel.setCurrentUser(result);
      this.model.setIsEditingPersonalInfo(false);
    } else {
      console.error('Failed to update customer via API:', result);
    }
  }

  private handleCancelEditPersonalInfo(): void {
    console.log('Cancel Edit Personal Info button CLICKED');
    this.model.setIsEditingPersonalInfo(false);
  }
}
