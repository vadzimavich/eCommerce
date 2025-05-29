import { Subscriber } from '../../../models/types';

export class ProfilePageModel {
  private isEditingPersonalInfo: boolean = false;
  private personalInfoEditListeners: Subscriber[] = [];

  constructor() {
    console.log('ProfilePageModel created');
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

  private notifyPersonalInfoEditListeners(): void {
    this.personalInfoEditListeners.forEach((listener) => listener());
  }
}
