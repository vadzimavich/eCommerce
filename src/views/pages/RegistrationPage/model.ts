import { DataForm, RequiredField } from '../../../models/types/common-types';

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
}
