import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { SecuritySectionView } from '../view/SecuritySectionView';
import { CustomerService } from '../../../../models/services/AuthService';
import * as handlerFields from '../../../../utils/handler-fields';
import * as errorTooltip from '../../../../utils/error-tooltip';
import type { HandlerInputFieldResult } from '../../../../models/types/common-types';

export class SecurityController {
  private customerService: CustomerService;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly view: SecuritySectionView,
    private readonly appModel: AppModel
  ) {
    this.customerService = CustomerService.getInstance();
    this.model.subscribePasswordEditMode(() => this.onEditModeChange());
  }

  public initializeListeners(): void {
    console.log('SecurityController: Initializing listeners...');
    if (this.view.mainChangePasswordButton) {
      this.view.mainChangePasswordButton.onclick = (): void => this.handleShowChangePasswordForm();
    }
    if (this.view.saveNewPasswordButton) {
      this.view.saveNewPasswordButton.onclick = (): void => {
        this.handleSaveNewPassword().catch((error) => console.error('Failed to save new password:', error));
      };
    }
    if (this.view.cancelChangePasswordButton) {
      this.view.cancelChangePasswordButton.onclick = (): void => this.handleCancelChangePassword();
    }

    const passwordInputs = [this.view.currentPasswordInput, this.view.newPasswordInput, this.view.confirmPasswordInput];
    passwordInputs.forEach((input) => {
      if (input) {
        input.removeEventListener('input', this.handlePasswordFormInputChange);
        input.addEventListener('input', this.handlePasswordFormInputChange);
      }
    });

    this.addPasswordViewToggleListener(this.view.currentPasswordInput, this.view.currentPasswordViewButton);
    this.addPasswordViewToggleListener(this.view.newPasswordInput, this.view.newPasswordViewButton);
    this.addPasswordViewToggleListener(this.view.confirmPasswordInput, this.view.confirmPasswordViewButton);
    this.updateSaveNewPasswordButtonState();
  }

  private onEditModeChange(): void {
    this.updateSaveNewPasswordButtonState();
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
      let validationResultForTooltip: HandlerInputFieldResult = { result: false };

      if (fieldId === 'profile-current-password') {
        const isValid = inputElement.value.trim().length >= 8;
        validationResultForTooltip = {
          result: isValid,
          errorMessage: isValid
            ? undefined
            : 'Current password should not be empty and typically meets length requirements.',
        };
      } else if (fieldId === 'profile-new-password') {
        validationResultForTooltip = handlerFields.handlerPasswordField(inputElement.value);
      } else if (fieldId === 'profile-confirm-password') {
        const newPassValue = this.view.newPasswordInput.value;
        const confirmPassValue = inputElement.value;
        const isNewPassFieldValidByOwnValidation = this.view.newPasswordInput.dataset.correct === 'true';

        const isMatching = newPassValue === confirmPassValue && newPassValue.length > 0;
        const isConfirmValid = isMatching && isNewPassFieldValidByOwnValidation;
        validationResultForTooltip = {
          result: isConfirmValid,
          errorMessage: isConfirmValid ? undefined : 'Passwords do not match or new password format is invalid.',
        };
      }
      errorTooltip.updateTooltip(inputElement, validationResultForTooltip);
      inputElement.setAttribute('data-correct', validationResultForTooltip.result.toString());
      this.model.updateChangePasswordFieldState(inputElement, validationResultForTooltip.result);
    }
  };

  private updateSaveNewPasswordButtonState = (): void => {
    if (this.view.saveNewPasswordButton && this.model.getIsPasswordEditModeActive()) {
      const isFormValid = this.model.isChangePasswordFormValid();
      this.view.saveNewPasswordButton.disabled = !isFormValid;
    } else if (this.view.saveNewPasswordButton) {
      this.view.saveNewPasswordButton.disabled = true;
    }
  };

  private handleShowChangePasswordForm(): void {
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

    if (this.view.saveNewPasswordButton) this.view.saveNewPasswordButton.disabled = true;

    const result = await this.customerService.changeCustomerPassword(currentUser.version, currentPassword, newPassword);

    if (result && !(result instanceof Error)) {
      this.model.setIsPasswordEditModeActive(false);
    } else {
      if (this.view.saveNewPasswordButton)
        this.view.saveNewPasswordButton.disabled = !this.model.isChangePasswordFormValid();
    }
  }

  private handleCancelChangePassword(): void {
    this.model.setIsPasswordEditModeActive(false);
  }
}
