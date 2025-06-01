import { AppModel } from '../../../models/state/AppState';
import { ProfilePageModel } from './profilePageModel';
import { ProfilePageView } from './view/profilePageView';
import type { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { CustomerService } from '../../../models/services/AuthService';
import { route } from '../../../app';
import * as handlerFields from '../../../utils/handler-fields';
import * as errorTooltip from '../../../utils/error-tooltip';
import type { HandlerInputFieldResult } from '../../../models/types/common-types';

export class ProfilePageController {
  private customerService: CustomerService;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: ProfilePageView,
    private readonly appModel: AppModel
  ) {
    this.customerService = CustomerService.getInstance();

    this.appModel.subscribeLoginStateListener((): void => {
      console.log('Controller: Login state changed, calling view.render() and initializePageListeners().');
      this.view.render();
      this.initializePageListeners();
    });

    this.model.subscribePersonalInfoEdit((): void => {
      console.log('Controller: Personal info edit mode changed. Updating save button state.');
      this.updateSaveButtonState();
    });

    this.model.subscribePasswordEditMode((): void => {
      console.log('Controller: Password edit mode changed. Forcing update of SaveNewPasswordButton state.');
      this.updateSaveNewPasswordButtonState();
    });
  }

  public initializePageListeners(): void {
    console.log('Controller: Initializing ALL page listeners.');
    this.attachPersonalInfoActionListeners();
    this.attachChangePasswordActionListeners();
  }

  // personal info
  private attachPersonalInfoActionListeners(): void {
    console.log('Controller: Attaching listeners for personal info buttons...');
    const editButton = this.view.getEditPersonalInfoButton();
    if (editButton) {
      editButton.onclick = (): void => this.handleEditPersonalInfo();
    } else console.warn('Controller: Edit Personal Info button NOT FOUND during listener attachment.');

    const saveButton = this.view.getSavePersonalInfoButton();
    if (saveButton) {
      saveButton.onclick = (): void => {
        this.handleSavePersonalInfo();
      };
    } else console.warn('Controller: Save Personal Info button NOT FOUND during listener attachment.');

    const cancelButton = this.view.getCancelPersonalInfoButton();
    if (cancelButton) {
      cancelButton.onclick = (): void => this.handleCancelEditPersonalInfo();
    } else console.warn('Controller: Cancel Personal Info button NOT FOUND during listener attachment.');

    const inputs = this.view.getPersonalInfoFormInputs();
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.removeEventListener('input', this.updateSaveButtonState);
        input.addEventListener('input', this.updateSaveButtonState);
      });
    } else {
      console.warn('Controller: Personal info inputs not found for attaching listeners.');
    }
  }

  private updateSaveButtonState = (): void => {
    const saveButton = this.view.getSavePersonalInfoButton();
    if (saveButton && this.model.getIsEditingPersonalInfo()) {
      saveButton.disabled = !this.view.isPersonalInfoFormValid();
    }
  };

  private handleEditPersonalInfo(): void {
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

    const result = await this.customerService.updateCustomerPersonalInfo(currentUser.version, actions);

    if (saveButton) saveButton.disabled = !this.view.isPersonalInfoFormValid();

    if (result && !(result instanceof Error)) {
      this.appModel.setCurrentUser(result);
      this.model.setIsEditingPersonalInfo(false);
    }
  }

  private handleCancelEditPersonalInfo(): void {
    console.log('Cancel Personal Info button CLICKED in controller');
    this.model.setIsEditingPersonalInfo(false);
  }

  // change password logic
  private attachChangePasswordActionListeners(): void {
    console.log('Controller: Attaching listeners for change password actions...');
    const changePassMainButton = this.view.getMainChangePasswordButton();
    if (changePassMainButton) {
      changePassMainButton.onclick = (): void => this.handleChangePasswordBtnClick();
    } else console.warn('Controller: "Change Password" main button not found.');

    const saveNewPassButton = this.view.getSaveNewPasswordButton();
    if (saveNewPassButton) {
      saveNewPassButton.onclick = (): void => {
        this.handleSaveNewPassword();
      };
    } else console.warn('Controller: "Save New Password" button not found.');

    const cancelChangePassButton = this.view.getCancelChangePasswordButton();
    if (cancelChangePassButton) {
      cancelChangePassButton.onclick = (): void => this.handleCancelChangePasswordClick();
    } else console.warn('Controller: "Cancel Change Password" button not found.');

    const currentPassInput = this.view.getCurrentPasswordInput();
    const newPassInput = this.view.getNewPasswordInput();
    const confirmPassInput = this.view.getConfirmPasswordInput();

    [currentPassInput, newPassInput, confirmPassInput].forEach((input) => {
      if (input) {
        input.removeEventListener('input', this.handlePasswordFormInputChange);
        input.addEventListener('input', this.handlePasswordFormInputChange);
      }
    });

    this.addPasswordViewToggleListener(this.view.getCurrentPasswordInput(), this.view.getCurrentPasswordViewButton());
    this.addPasswordViewToggleListener(this.view.getNewPasswordInput(), this.view.getNewPasswordViewButton());
    this.addPasswordViewToggleListener(this.view.getConfirmPasswordInput(), this.view.getConfirmPasswordViewButton());
  }

  private addPasswordViewToggleListener(input: HTMLInputElement | null, button: HTMLButtonElement | null): void {
    if (input && button) {
      button.onclick = (): void => {
        if (input.type === 'password') {
          input.type = 'text';
          button.classList.add('view');
        } else {
          input.type = 'password';
          button.classList.remove('view');
        }
      };
    }
  }

  private handlePasswordFormInputChange = (event: Event): void => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const fieldId = inputElement.id;
      let isSpecificValidationCorrect: boolean | undefined;
      let validationResultForTooltip: HandlerInputFieldResult = { result: false };

      if (fieldId === 'profile-current-password') {
        const isValid = inputElement.value.trim() !== '';
        isSpecificValidationCorrect = isValid;
        validationResultForTooltip = {
          result: isValid,
          errorMessage: isValid ? undefined : 'Current password cannot be empty.',
        };
      } else if (fieldId === 'profile-new-password') {
        const validationResult = handlerFields.handlerPasswordField(inputElement.value);
        isSpecificValidationCorrect = validationResult.result;
        validationResultForTooltip = validationResult;
      } else if (fieldId === 'profile-confirm-password') {
        const newPassInput = this.view.getNewPasswordInput();
        if (newPassInput) {
          const newPassValue = newPassInput.value;
          const confirmPassValue = inputElement.value;
          const isNewPassFieldValidByOwnValidation = newPassInput.dataset.correct === 'true';
          const isMatching = newPassValue === confirmPassValue && newPassValue.length > 0;
          const isConfirmValid = isMatching && isNewPassFieldValidByOwnValidation;
          validationResultForTooltip = {
            result: isConfirmValid,
            errorMessage: isConfirmValid ? undefined : 'Passwords do not match or new password is not valid.',
          };
        } else {
          validationResultForTooltip = { result: false, errorMessage: 'New password field not found.' };
        }
      }
      console.log(`Tooltip update for ${inputElement.id}:`, JSON.stringify(validationResultForTooltip)); // debug
      errorTooltip.updateTooltip(inputElement, validationResultForTooltip);
      inputElement.setAttribute('data-correct', validationResultForTooltip.result.toString());
      this.model.updateChangePasswordFieldState(inputElement, isSpecificValidationCorrect);
    }
  };

  private updateSaveNewPasswordButtonState(): void {
    const saveButton = this.view.getSaveNewPasswordButton();
    if (saveButton && this.model.getIsPasswordEditModeActive()) {
      const isFormValid = this.model.isChangePasswordFormValid();
      saveButton.disabled = !isFormValid;
      console.log('Updating SaveNewPasswordButton, isFormValid:', isFormValid, 'disabled:', saveButton.disabled); // debug
      console.log('Model status for validity check:', JSON.stringify(this.model.changePasswordStatusForm)); // debug
    }
  }

  private handleChangePasswordBtnClick(): void {
    console.log('Controller: handleChangePasswordBtnClick');
    this.model.setIsPasswordEditModeActive(true);
  }

  private async handleSaveNewPassword(): Promise<void> {
    if (!this.model.isChangePasswordFormValid()) {
      this.customerService.modal.errorMessage('Please correct the errors in the change password form.');
      return;
    }
    const formData = this.model.changePasswordDataForm;
    const currentPassword = formData['profile-current-password'];
    const newPassword = formData['profile-new-password'];
    const currentUser = this.appModel.getCurrentUser();

    if (!currentUser.id || typeof currentUser.version !== 'number' || !currentUser.email) {
      this.customerService.modal.errorMessage('Cannot change password: user data is incomplete.');
      return;
    }

    const saveButton = this.view.getSaveNewPasswordButton();
    if (saveButton) saveButton.disabled = true;

    const result = await this.customerService.changeCustomerPassword(currentUser.version, currentPassword, newPassword);

    if (result && !(result instanceof Error)) {
      this.model.setIsPasswordEditModeActive(false);
      this.appModel.logout();
      route.navigate('/sign-in');
    } else {
      if (saveButton) saveButton.disabled = false;
    }
  }

  private handleCancelChangePasswordClick(): void {
    this.model.setIsPasswordEditModeActive(false);
  }
}
