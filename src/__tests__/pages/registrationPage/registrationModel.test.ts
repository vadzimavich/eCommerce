/**
 * @jest-environment jsdom
 */

import { elementCreator } from '../../../utils/dom-helpers';
import { RegistrationModel } from '../../../views/pages/RegistrationPage/model';

// eslint-disable-next-line max-lines-per-function
describe('ProductModel:', () => {
  let registrationModel = new RegistrationModel();
  const mockModel = {
    statusForm: {
      'shipping-street': false,
      'billing-street': false,
      'shipping-country': true,
      'billing-country': true,
    },
    dataForm: {
      'shipping-street': '',
      'billing-street': '',
      'shipping-country': 'country',
      'billing-country': 'country',
    },
    shippingFields: ['shipping-street', 'shipping-country', 'shipping-city', 'shipping-postal-code'],
    billingFields: ['billing-street', 'billing-country', 'billing-city', 'billing-postal-code'],
    getDataForm: registrationModel.getDataForm,
    setStatusForm: registrationModel.setStatusForm,
    setDataForm: registrationModel.setDataForm,
    copyDataShippingToBilling: registrationModel.copyDataShippingToBilling,
    checkValues: registrationModel.checkValues,
    updateData: registrationModel.updateData,
    checkShippingFieldsValidation: registrationModel.checkShippingFieldsValidation,
    clearDataBillingFields: registrationModel.clearDataBillingFields,
    createCustomerSignUpBody: registrationModel.createCustomerSignUpBody,
    notifySubmitButtonListener: jest.fn(),
    notifychekboxBillToShippingListener: jest.fn(),
    createDataRequest: jest.fn(),
  };

  beforeEach(() => {
    mockModel.getDataForm = registrationModel.getDataForm;
    mockModel.setStatusForm = registrationModel.setStatusForm;
    mockModel.setDataForm = registrationModel.setDataForm;
    mockModel.copyDataShippingToBilling = registrationModel.copyDataShippingToBilling;
    mockModel.checkValues = registrationModel.checkValues;
    mockModel.updateData = registrationModel.updateData;
    mockModel.checkShippingFieldsValidation = registrationModel.checkShippingFieldsValidation;
    mockModel.clearDataBillingFields = registrationModel.clearDataBillingFields;
    mockModel.createCustomerSignUpBody = registrationModel.createCustomerSignUpBody;
  });

  test('setDataForm(): should set data', () => {
    mockModel.setDataForm('billing-street', 'billing-street');

    expect(mockModel.dataForm['billing-street']).toEqual('billing-street');
  });

  test('setStatusForm(): should set data status and does not call notifySubmitButtonListener', () => {
    mockModel.setStatusForm('billing-street', true);

    expect(mockModel.statusForm['billing-street']).toBe(true);
    expect(mockModel.notifySubmitButtonListener).toHaveBeenCalled();
    expect(mockModel.notifychekboxBillToShippingListener).not.toHaveBeenCalled();
  });

  describe('checkValues():', () => {
    test('should return false', () => {
      const result = mockModel.checkValues();

      expect(result).toBe(false);
    });

    test('should return true', () => {
      mockModel.setDataForm('shipping-street', 'shipping-street');
      mockModel.setStatusForm('shipping-street', true);

      const result = mockModel.checkValues();

      expect(result).toBe(true);
    });
  });

  test('updateData(): should update data', () => {
    const input = elementCreator(document.createElement('input'), {
      attributes: {
        id: 'shipping-street',
        value: 'street',
        ['data-correct']: 'true',
      },
    });

    mockModel.updateData(input);
    expect(mockModel.dataForm['shipping-street']).toBe('street');
  });

  test('checkShippingFieldsValidation(): should return true', () => {
    mockModel.getDataForm = jest.fn().mockReturnValue({
      'shipping-street': 'street',
      'shipping-country': 'country',
      'shipping-city': 'city',
      'shipping-postal-code': '12345',
    });

    const result = mockModel.checkShippingFieldsValidation();

    expect(result).toBe(true);
  });

  test('copyDataShippingToBilling():', () => {
    mockModel.getDataForm = jest.fn().mockReturnValue({ ['shipping-street']: 'street' });

    mockModel.copyDataShippingToBilling();

    expect(mockModel.getDataForm).toHaveBeenCalled();
    expect(mockModel.dataForm['billing-street']).toBe('street');
  });

  test('clearDataBillingFields():', () => {
    mockModel.dataForm['billing-street'] = 'street';
    mockModel.dataForm['billing-country'] = 'country';

    mockModel.clearDataBillingFields();

    expect(mockModel.dataForm['billing-street']).toBe('');
    expect(mockModel.dataForm['billing-country']).toBe('country');
  });

  // eslint-disable-next-line max-lines-per-function
  test('createCustomerSignUpBody():', () => {
    const mockDataRequest = {
      email: 'email',
      password: 'password',
      firstName: 'first-name',
      lastName: 'last-name',
      dateOfBirth: 'bday',
      shippingAddress: {
        country: 'shipping-country',
        city: 'shipping-city',
        streetName: 'shipping-street',
        postalCode: 'shipping-postal-code',
      },
      billingAddress: {
        country: 'billing-country',
        city: 'billing-city',
        streetName: 'billing-street',
        postalCode: 'billing-postal-code',
      },
      isShippingDefault: true,
      isBillingDefault: true,
      billToShippingAddress: false,
    };

    mockModel.createDataRequest = jest.fn().mockReturnValue(mockDataRequest);

    const result = mockModel.createCustomerSignUpBody();

    expect(mockModel.createDataRequest).toHaveBeenCalled();
    expect(result).toEqual({
      email: 'email',
      password: 'password',
      firstName: 'first-name',
      lastName: 'last-name',
      dateOfBirth: 'bday',
      addresses: [
        {
          firstName: 'first-name',
          country: 'shipping-country',
          city: 'shipping-city',
          streetName: 'shipping-street',
          postalCode: 'shipping-postal-code',
        },
        {
          firstName: 'first-name',
          country: 'billing-country',
          city: 'billing-city',
          streetName: 'billing-street',
          postalCode: 'billing-postal-code',
        },
      ],
      shippingAddressIds: [0],
      billingAddressesIds: [1],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
    });
  });
});
