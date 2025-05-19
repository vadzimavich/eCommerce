import { DataForm, RequiredField } from '../../../models/types/common-types';
import { CustomerLoginData } from '../../../models/types/api-types';

export class LoginPageModel {
  public dataForm: DataForm = {};
  public statusForm: RequiredField = {};

  constructor() {
    this.statusForm['login-email'] = false;
    this.statusForm['login-password'] = false;
    this.dataForm['login-email'] = '';
    this.dataForm['login-password'] = '';
  }

  public setDataField(fieldName: string, value: string): void {
    this.dataForm[fieldName] = value;
  }

  public setStatusField(fieldName: string, isValid: boolean): void {
    this.statusForm[fieldName] = isValid;
  }

  public updateFieldState(element: HTMLInputElement): void {
    this.setDataField(element.id, element.value);
    const isCorrect = element.dataset.correct === 'true';
    this.setStatusField(element.id, isCorrect);
  }

  public getLoginData(): CustomerLoginData {
    return {
      email: this.dataForm['login-email'],
      password: this.dataForm['login-password'],
    };
  }

  public isFormValid(): boolean {
    const requiredFields = ['login-email', 'login-password'];

    if (requiredFields.some((field) => !(field in this.statusForm))) {
      return false;
    }

    return requiredFields.every((field) => this.statusForm[field] === true);
  }
}
