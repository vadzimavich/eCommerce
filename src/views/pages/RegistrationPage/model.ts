import { RequiredField, DataForm } from '../../../models/types/common-types';
import { CustomerRegistrationData, CustomerDraftBody, CustomerAddress } from '../../../models/types/api-types';

export class RegistrationModel {
  private readonly dataForm: DataForm;
  private readonly statusForm: RequiredField;

  constructor() {
    this.dataForm = {};
    this.statusForm = {};
  }

  public setDataForm(id: string, data: string): void {
    this.dataForm[id] = data;
  }

  public setStatusForm(id: string, data: boolean): void {
    this.statusForm[id] = data;
  }

  public getDataForm(): DataForm {
    return this.dataForm;
  }

  public getStatusForm(): RequiredField {
    return this.statusForm;
  }

  public checkValues(): boolean {
    return Object.values(this.statusForm).every((item) => item);
  }

  public updateData(element: HTMLInputElement | HTMLSelectElement): void {
    this.setDataForm(element.id, element.value);
    this.setStatusForm(element.id, element.dataset.correct === 'true' ? true : false);
  }

  public createCustomerSignUpBody(): CustomerDraftBody {
    const data = this.createDataRequest();

    const addresses: CustomerAddress[] = [];
    data.shippingAddress.firstName = data.firstName;
    const shippingAddressIndex = addresses.push(data.shippingAddress) - 1;

    let billingAddressIndex: number;
    if (!data.billToShippingAddress && data.billingAddress) {
      data.billingAddress.firstName = data.firstName;
      billingAddressIndex = addresses.push(data.billingAddress) - 1;
    } else {
      billingAddressIndex = shippingAddressIndex;
    }

    const body: CustomerDraftBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses,
      shippingAddressIds: [shippingAddressIndex],
      billingAddressesIds: [billingAddressIndex],
    };

    if (data.isShippingDefault) {
      body.defaultShippingAddress = shippingAddressIndex;
    }

    if (data.isBillingDefault) {
      body.defaultBillingAddress = billingAddressIndex;
    }

    return body;
  }

  private createDataRequest(): CustomerRegistrationData {
    const data: CustomerRegistrationData = {
      email: this.dataForm.email,
      password: this.dataForm.password,
      firstName: this.dataForm['first-name'],
      lastName: this.dataForm['last-name'],
      dateOfBirth: this.dataForm['bday'],
      shippingAddress: {
        country: this.getCodeCountry(this.dataForm['shipping-country']),
        city: this.dataForm['shipping-city'],
        streetName: this.dataForm['shipping-street'],
        postalCode: this.dataForm['shipping-postal-code'],
      },
      billingAddress: {
        country: this.getCodeCountry(this.dataForm['billing-country']),
        city: this.dataForm['billing-city'],
        streetName: this.dataForm['billing-street'],
        postalCode: this.dataForm['billing-postal-code'],
      },
      isShippingDefault: this.dataForm['shipping'] === 'true' ? true : false,
      isBillingDefault: this.dataForm['billing'] === 'true' ? true : false,
      billToShippingAddress: this.dataForm['bill'] === 'true' ? true : false,
    };

    return data;
  }

  private getCodeCountry(country: string): string {
    if (country === 'USA') {
      return 'US';
    } else if (country === 'Canada') {
      return 'CA';
    } else {
      return '';
    }
  }
}
