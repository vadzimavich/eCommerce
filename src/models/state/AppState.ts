import { Subscriber } from '../types';

export class AppModel {
  private currentUser: string = '';
  private currentUserListener: Subscriber[] = [];

  public setCurrentUser(user: string): void {
    this.currentUser = user;
    sessionStorage.setItem('currentUser', this.currentUser);
    this.notifyUserListener();
  }

  public initUserFromSession(): void {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = storedUser;
      this.notifyUserListener();
    }
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
