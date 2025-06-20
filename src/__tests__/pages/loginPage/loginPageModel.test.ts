/**
 * @jest-environment jsdom
 */

import { elementCreator } from '../../../utils/dom-helpers';
import { LoginPageModel } from '../../../views/pages/LoginPage/model';

// eslint-disable-next-line max-lines-per-function
describe('LoginPageModel', () => {
  let loginModel = new LoginPageModel();
  const mockModel = {
    statusForm: { 'login-email': false, 'login-password': false },
    dataForm: { 'login-email': '', 'login-password': '' },
    setDataField: loginModel.setDataField,
    setStatusField: loginModel.setStatusField,
    updateFieldState: loginModel.updateFieldState,
    getLoginData: loginModel.getLoginData,
    isFormValid: loginModel.isFormValid,
  };

  beforeEach(() => {
    mockModel.setDataField = loginModel.setDataField;
    mockModel.setStatusField = loginModel.setStatusField;
    mockModel.updateFieldState = loginModel.updateFieldState;
    mockModel.getLoginData = loginModel.getLoginData;
    mockModel.isFormValid = loginModel.isFormValid;
  });

  test('setDataForm(): updates dataForm field correctly', () => {
    mockModel.setDataField('login-email', 'test@gmail.com');

    expect(mockModel.dataForm['login-email']).toBe('test@gmail.com');
  });

  test('setStatusField(): updates statusForm field correctly', () => {
    mockModel.setStatusField('login-email', true);

    expect(mockModel.statusForm['login-email']).toBe(true);
  });

  test('updateFieldState(): updates dataForm and statusForm based on input element', () => {
    const mockElement = elementCreator(document.createElement('input'), {
      attributes: { id: 'login-email', value: 'test2@gmail.com', 'data-correct': 'true' },
    });

    mockModel.updateFieldState(mockElement);

    expect(mockModel.dataForm['login-email']).toBe('test2@gmail.com');
    expect(mockModel.statusForm['login-email']).toBe(true);
  });

  test('getLoginData(): returns correct login data object', () => {
    const result = mockModel.getLoginData();

    expect(result).toEqual({ email: 'test2@gmail.com', password: '' });
  });

  describe('isFormValid():', () => {
    test('returns false when form fields are invalid', () => {
      const result = mockModel.isFormValid();

      expect(result).toBe(false);
    });

    test('returns true when all form fields are valid', () => {
      mockModel.dataForm['login-password'] = '12345^Yh';
      mockModel.statusForm['login-password'] = true;
      const result = mockModel.isFormValid();

      expect(result).toBe(true);
    });
  });
});
