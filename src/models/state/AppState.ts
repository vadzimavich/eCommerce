import { Subscriber } from '../types';

export class AppModel {
  private currentUser: string = '';
  private currentHash: string = '/';
  private currentUserListener: Subscriber[] = [];
  private currentPageListener: Subscriber[] = [];

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

  public getCurrentRoute(): string {
    return this.currentHash;
  }

  public setCurrentHash(hash: string): void {
    this.currentHash = hash;
    this.notifyCurrentPageListener();
  }

  public subscribeUsersListener(callback: () => void): void {
    this.currentUserListener.push(callback);
  }

  public subscribeCurrentPageListener(callback: () => void): void {
    this.currentPageListener.push(callback);
  }

  private notifyUserListener(): void {
    this.currentUserListener.forEach((callback) => callback());
  }

  private notifyCurrentPageListener(): void {
    this.currentPageListener.forEach((callback) => callback());
  }
}
