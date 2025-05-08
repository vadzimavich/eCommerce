import { Subscriber } from '../types';

export class AppModel {
  private currentUser: string = '';
  private currentUserListener: Subscriber[] = [];

  public setCurrentUser(user: string): void {
    this.currentUser = user;
    this.notifyUserListener();
  }
  public getCurrentUser(): string {
    return this.currentUser;
  }

  public subscribeUsersListener(callback: () => void): void {
    this.currentUserListener.push(callback);
  }

  private notifyUserListener(): void {
    this.currentUserListener.forEach((callback) => callback());
  }
}
