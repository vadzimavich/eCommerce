import { Subscriber } from '../../../models/types';
import { DataForm, RequiredField } from '../../../models/types/common-types';

export class ProfilePageModel {
  public changePasswordDataForm: DataForm = {};
  public changePasswordStatusForm: RequiredField = {};

  private isEditingPersonalInfo: boolean = false;
  private personalInfoEditListeners: Subscriber[] = [];

  private isPasswordEditModeActive: boolean = false;
  private passwordEditModeListeners: Subscriber[] = [];

  constructor() {
    this.initChangePasswordFormState();
  }

  public getIsEditingPersonalInfo(): boolean {
    return this.isEditingPersonalInfo;
  }

  public setIsEditingPersonalInfo(isEditing: boolean): void {
    this.isEditingPersonalInfo = isEditing;
    this.notifyPersonalInfoEditListeners();
  }

  public subscribePersonalInfoEdit(listener: Subscriber): void {
    this.personalInfoEditListeners.push(listener);
  }

  public getIsPasswordEditModeActive(): boolean {
    return this.isPasswordEditModeActive;
  }

  public setIsPasswordEditModeActive(isActive: boolean): void {
    this.isPasswordEditModeActive = isActive;
    if (!isActive) {
      this.initChangePasswordFormState();
    } else {
      this.initChangePasswordFormState();
    }
    this.notifyPasswordEditModeListeners();
  }

  public subscribePasswordEditMode(listener: Subscriber): void {
    this.passwordEditModeListeners.push(listener);
  }

  public updateChangePasswordFieldState(element: HTMLInputElement, isPasswordValid?: boolean): void {
    const fieldId = element.id;
    this.changePasswordDataForm[fieldId] = element.value;

    if (fieldId === 'profile-current-password') {
      this.changePasswordStatusForm[fieldId] = element.value.trim().length > 0;
    } else if (fieldId === 'profile-new-password') {
      this.changePasswordStatusForm[fieldId] = isPasswordValid || false;
    }

    if (
      this.changePasswordDataForm['profile-new-password'] !== undefined &&
      this.changePasswordDataForm['profile-confirm-password'] !== undefined
    ) {
      const newPassword = this.changePasswordDataForm['profile-new-password'];
      const confirmPassword = this.changePasswordDataForm['profile-confirm-password'];
      const isNewPasswordInputActuallyValid = this.changePasswordStatusForm['profile-new-password'] === true;

      this.changePasswordStatusForm['profile-confirm-password'] =
        newPassword === confirmPassword && newPassword.length > 0 && isNewPasswordInputActuallyValid;
    }
    this.notifyPasswordEditModeListeners();
  }

  public isChangePasswordFormValid(): boolean {
    const currentPassValid = this.changePasswordStatusForm['profile-current-password'] === true;
    const newPassValid = this.changePasswordStatusForm['profile-new-password'] === true;
    const confirmPassValid = this.changePasswordStatusForm['profile-confirm-password'] === true;

    return currentPassValid && newPassValid && confirmPassValid;
  }

  private notifyPersonalInfoEditListeners(): void {
    this.personalInfoEditListeners.forEach((listener) => listener());
  }

  private initChangePasswordFormState(): void {
    this.changePasswordDataForm = {
      'profile-current-password': '',
      'profile-new-password': '',
      'profile-confirm-password': '',
    };
    this.changePasswordStatusForm = {
      'profile-current-password': false,
      'profile-new-password': false,
      'profile-confirm-password': false,
    };
  }

  private notifyPasswordEditModeListeners(): void {
    this.passwordEditModeListeners.forEach((listener) => listener());
  }
}
