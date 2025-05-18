import { Subscriber } from '../../../models/types';
import { DataForm, RequiredField } from '../../../models/types/common-types';

export class RegistrationModel {
  private readonly dataForm: DataForm;
  private readonly statusForm: RequiredField;
  private submitButtonListener: Subscriber[] = [];
  private chekboxBillToShippingListener: Subscriber[] = [];
  private readonly shippingFields: string[] = [
    'shipping-street',
    'shipping-country',
    'shipping-city',
    'shipping-portal-code',
  ];
  private readonly billingFields: string[] = [
    'billing-street',
    'billing-country',
    'billing-city',
    'billing-portal-code',
  ];
  constructor() {
    this.dataForm = {};
    this.statusForm = {};
  }

  public setDataForm(id: string, data: string): void {
    this.dataForm[id] = data;
  }

  public setStatusForm(id: string, data: boolean): void {
    this.statusForm[id] = data;
    this.notifySubmitButtonListener();

    if (this.shippingFields.includes(id)) {
      this.notifychekboxBillToShippingListener();
    }
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
    console.log(this.dataForm);
  }

  public checkShippingFieldsValidation(): boolean {
    const formData = this.getDataForm();

    const isComplete = this.shippingFields.every((field) => {
      const value = formData[field];
      return typeof value === 'string' && value.trim() !== '';
    });

    return isComplete;
  }

  public copyDataShippingToBilling(): void {
    const formData = this.getDataForm();
    this.billingFields.forEach((field, index) => {
      this.setDataForm(field, formData[this.shippingFields[index]]);
      this.setStatusForm(field, true);
    });
  }

  public clearDataBillingFields(): void {
    this.billingFields.forEach((field) => {
      this.setDataForm(field, '');
      this.setStatusForm(field, false);
    });
  }

  public subscribeSubmitButtonListener(callback: () => void): void {
    this.submitButtonListener.push(callback);
  }

  public subscribechekboxBillToShippingListener(callback: () => void): void {
    this.chekboxBillToShippingListener.push(callback);
  }
  private notifychekboxBillToShippingListener(): void {
    this.chekboxBillToShippingListener.forEach((callback) => callback());
  }
  private notifySubmitButtonListener(): void {
    this.submitButtonListener.forEach((callback) => callback());
  }
}
