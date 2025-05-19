import { DataForm, RequiredField } from '../../../models/types/common-types';

export class LoginPageModel {
  public dataForm: DataForm = {};
  public statusForm: RequiredField = {};

  constructor() {
    this.statusForm['login-email'] = false;
    this.statusForm['login-password'] = false;
  }
}
