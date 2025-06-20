/**
 * @jest-environment jsdom
 */

import { LoginPageModel } from '../../../views/pages/LoginPage/model';
import { LoginPageView } from '../../../views/pages/LoginPage/view';

// eslint-disable-next-line max-lines-per-function
describe('LoginPageView', () => {
  let view: LoginPageView;
  let mockModel: LoginPageModel & {
    isFormValid: jest.Mock<boolean, []>;
  };

  beforeEach(() => {
    mockModel = {
      statusForm: { 'login-email': false, 'login-password': false },
      dataForm: { 'login-email': '', 'login-password': '' },
      setDataField: jest.fn(),
      setStatusField: jest.fn(),
      updateFieldState: jest.fn(),
      getLoginData: jest.fn(),
      isFormValid: jest.fn(),
    };
    view = new LoginPageView(mockModel);
  });

  describe('render()', () => {
    test('should create the login form with all elements', () => {
      const container = view.render();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.classList.contains('login-page')).toBe(true);
      expect(container.querySelector('form')).toBeTruthy();
      expect(container.querySelector('h1')?.textContent).toBe('Sign In');
      expect(container.querySelector('.login-form__link-to-reg')).toBeTruthy();
      expect(container.querySelector('button[type="submit"]')).toBeTruthy();
    });
  });

  describe('updateSubmitButtonState()', () => {
    test('should enable submit button if form is valid', () => {
      mockModel.isFormValid.mockReturnValue(true);
      view.updateSubmitButtonState();
      expect(view.submitButton.disabled).toBe(false);
    });

    test('should disable submit button if form is invalid', () => {
      mockModel.isFormValid.mockReturnValue(false);
      view.updateSubmitButtonState();
      expect(view.submitButton.disabled).toBe(true);
    });
  });

  describe('displayLoginError()', () => {
    test('should display error message', () => {
      const errorMessage = 'Invalid email or password';
      view.displayLoginError(errorMessage);

      const errorElement = view.form.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toBe(errorMessage);
    });

    test('should clear previous error message before displaying a new one', () => {
      view.displayLoginError('First error message');
      view.displayLoginError('Second error message');

      const errorElements = view.form.querySelectorAll('.error-message');
      expect(errorElements.length).toBe(1);
      expect(errorElements[0].textContent).toBe('Second error message');
    });
  });

  describe('clearLoginError()', () => {
    test('should remove the error message', () => {
      view.displayLoginError('Error message to clear');
      view.clearLoginError();

      const errorElement = view.form.querySelector('.error-message');
      expect(errorElement).toBeNull();
    });
  });

  describe('togglePasswordVisibility()', () => {
    test('should change password input type to text when toggled', () => {
      view.togglePasswordVisibility();
      expect(view.passwordInput.type).toBe('text');
      expect(view.passwordViewButton.classList.contains('view')).toBe(true);
    });

    test('should change password input type to password when toggled again', () => {
      view.passwordInput.type = 'text';
      view.togglePasswordVisibility();
      expect(view.passwordInput.type).toBe('password');
      expect(view.passwordViewButton.classList.contains('view')).toBe(false);
    });
  });
});
