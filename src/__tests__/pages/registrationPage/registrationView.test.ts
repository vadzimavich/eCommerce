/**
 * @jest-environment jsdom
 */

import { RegistrationModel } from '../../../views/pages/RegistrationPage/model';
import { RegistrationView } from '../../../views/pages/RegistrationPage/View/view';

jest.mock('../../../views/pages/RegistrationPage/model');

// eslint-disable-next-line max-lines-per-function
describe('Registration', () => {
  let mockModel: RegistrationModel;
  let registrationView: RegistrationView;

  beforeEach(() => {
    mockModel = new RegistrationModel();
    registrationView = new RegistrationView(mockModel);
  });

  test('should be defined', () => {
    expect(registrationView).toBeDefined();
  });

  test('render(): should return the container element', () => {
    const result = registrationView.render();
    expect(result).toBeInstanceOf(HTMLElement);
  });

  test('changeButtonSubmit(): should enable submit button when checkValues returns true', () => {
    const mockSubmitButton = {
      disabled: true,
    };

    let mockView = {
      submitButton: mockSubmitButton,
      changeButtonSubmit: registrationView.changeButtonSubmit,
      model: {
        checkValues: jest.fn(),
      },
    };

    jest.spyOn(mockView.model, 'checkValues').mockReturnValue(true);
    mockView.changeButtonSubmit();

    expect(mockView.model.checkValues).toHaveBeenCalled();
    expect(mockSubmitButton.disabled).toBe(false);
  });

  test('changeButtonSubmit(): should disable submit button when checkValues returns false', () => {
    const mockSubmitButton = {
      disabled: false,
    };

    let mockView = {
      submitButton: mockSubmitButton,
      changeButtonSubmit: registrationView.changeButtonSubmit,
      model: {
        checkValues: jest.fn(),
      },
    };

    jest.spyOn(mockView.model, 'checkValues').mockReturnValue(false);

    mockView.changeButtonSubmit();

    expect(mockView.model.checkValues).toHaveBeenCalled();
    expect(mockSubmitButton.disabled).toBe(true);
  });

  test('updateViewPassword(): should hide password when it is visible', () => {
    let mockView = {
      buttonViewPassword: registrationView.getButtonViewPassword(),
      inputPassword: document.createElement('input'),
      updateViewPassword: registrationView.updateViewPassword,
    };

    mockView.inputPassword.setAttribute('type', 'text');

    mockView.updateViewPassword();

    expect(mockView.inputPassword.getAttribute('type')).toBe('password');
    expect(mockView.buttonViewPassword.classList).not.toContain('view');
  });

  test('updateViewPassword(): should show password when it is hidden', () => {
    let mockView = {
      buttonViewPassword: registrationView.getButtonViewPassword(),
      inputPassword: document.createElement('input'),
      updateViewPassword: registrationView.updateViewPassword,
    };

    mockView.inputPassword.setAttribute('type', 'password');

    mockView.updateViewPassword();

    expect(mockView.inputPassword.getAttribute('type')).toBe('text');
    expect(mockView.buttonViewPassword.classList).toContain('view');
  });

  test('updateViewChekboxShippingToBill(): should enable checkbox when checkShippingFieldsValidation returns true', () => {
    let mockView = {
      checkboxBillToShipping: document.createElement('div'),
      changeButtonSubmit: registrationView.updateViewChekboxShippingToBill,
      model: {
        checkShippingFieldsValidation: jest.fn(),
      },
    };

    mockView.checkboxBillToShipping.classList.add('disabled');

    jest.spyOn(mockView.model, 'checkShippingFieldsValidation').mockReturnValue(true);

    mockView.changeButtonSubmit();

    expect(mockView.model.checkShippingFieldsValidation).toHaveBeenCalled();
    expect(mockView.checkboxBillToShipping.classList).not.toContain('disabled');
  });

  test('updateViewChekboxShippingToBill(): should disable checkbox when checkShippingFieldsValidation returns false', () => {
    let mockView = {
      checkboxBillToShipping: document.createElement('div'),
      changeButtonSubmit: registrationView.updateViewChekboxShippingToBill,
      model: {
        checkShippingFieldsValidation: jest.fn(),
      },
    };

    jest.spyOn(mockView.model, 'checkShippingFieldsValidation').mockReturnValue(false);

    mockView.changeButtonSubmit();

    expect(mockView.model.checkShippingFieldsValidation).toHaveBeenCalled();
    expect(mockView.checkboxBillToShipping.classList).toContain('disabled');
  });

  test('updateBillingFields(): should update billing fields with data from model', () => {
    const mockView = {
      inputBillStreet: document.createElement('input'),
      inputBillCountry: document.createElement('select'),
      inputBillCity: document.createElement('input'),
      inputBillPostCode: document.createElement('input'),
      updateBillingFields: registrationView.updateBillingFields,
      model: {
        getDataForm: jest.fn(),
      },
    };

    let mockFormData = {
      ['billing-street']: 'street',
      ['billing-country']: 'country',
      ['billing-city']: 'city',
      ['billing-postal-code']: 'postal-code',
    };

    jest.spyOn(mockView.model, 'getDataForm').mockReturnValue(mockFormData);

    mockView.updateBillingFields();

    expect(mockView.model.getDataForm).toHaveBeenCalled();
    expect(mockView.inputBillStreet.value).toBe('street');
    expect(mockView.inputBillCountry.value).toBe('');
    expect(mockView.inputBillCity.value).toBe('city');
    expect(mockView.inputBillPostCode.value).toBe('postal-code');
  });
});
