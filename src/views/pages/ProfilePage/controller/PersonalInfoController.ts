import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { PersonalInformationView } from '../view/PersonalInformationView';
import { CustomerService } from '../../../../models/services/AuthService';
import type { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';

export class PersonalInfoController {
  private customerService: CustomerService;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: PersonalInformationView,
    private readonly appModel: AppModel
  ) {
    this.customerService = CustomerService.getInstance();
    this.model.subscribePersonalInfoEdit(() => this.onEditModeChange());
  }

  public initializeListeners(): void {
    console.log('PersonalInfoController: Initializing listeners...');
    if (this.view.editButton) {
      this.view.editButton.onclick = (): void => this.handleEdit();
    }
    if (this.view.saveButton) {
      this.view.saveButton.onclick = (): void => {
        this.handleSave().catch((error) => console.error('Failed to save personal info:', error));
      };
    }
    if (this.view.cancelButton) {
      this.view.cancelButton.onclick = (): void => this.handleCancel();
    }

    const inputs = [
      this.view.getFirstNameInput(),
      this.view.getLastNameInput(),
      this.view.getEmailInput(),
      this.view.getDateOfBirthInput(),
    ];
    inputs.forEach((input) => {
      if (input) {
        input.removeEventListener('input', this.updateSaveButtonState);
        input.addEventListener('input', this.updateSaveButtonState);
      }
    });
    this.updateSaveButtonState();
  }

  private onEditModeChange(): void {
    this.updateSaveButtonState();
  }

  private updateSaveButtonState = (): void => {
    if (this.view.saveButton && this.model.getIsEditingPersonalInfo()) {
      this.view.saveButton.disabled = !this.view.isFormValid();
    } else if (this.view.saveButton) {
      this.view.saveButton.disabled = true;
    }
  };

  private handleEdit(): void {
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
    if (
      newValues.dateOfBirth &&
      newValues.dateOfBirth.trim() !== '' &&
      newValues.dateOfBirth !== (currentUser.dateOfBirth || '')
    ) {
      actions.push({ action: 'setDateOfBirth', dateOfBirth: newValues.dateOfBirth });
    } else if ((!newValues.dateOfBirth || newValues.dateOfBirth.trim() === '') && currentUser.dateOfBirth) {
      console.warn('Date of birth cleared by user, not sending setDateOfBirth action.');
    }
    return actions;
  }

  private async handleSave(): Promise<void> {
    if (!this.view.isFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the personal information form.');
      return;
    }
    const newValues = this.view.getFormValues();
    const currentUser = this.appModel.getCurrentUser();

    if (!newValues || !currentUser.id || typeof currentUser.version !== 'number') {
      this.customerService.modal.errorMessage('User data is incomplete or form values are missing.');
      return;
    }

    const actions = this.createUpdateActions(newValues, currentUser);

    if (actions.length === 0) {
      this.customerService.modal.infoMessage('No changes detected in personal information.');
      this.model.setIsEditingPersonalInfo(false);
      return;
    }

    if (this.view.saveButton) this.view.saveButton.disabled = true;

    const result = await this.customerService.updateCustomerPersonalInfo(currentUser.version, actions);

    if (result && !(result instanceof Error)) {
      this.appModel.setCurrentUser(result);
      this.model.setIsEditingPersonalInfo(false);
    } else {
      if (this.view.saveButton) this.view.saveButton.disabled = !this.view.isFormValid();
    }
  }

  private handleCancel(): void {
    this.model.setIsEditingPersonalInfo(false);
  }
}
