// export class AppModel {
//   // NOTE: Это тестовое поле для проверки роутинга и доступа для авторизированного и не авторизированного пользователя. В будущем планируем типизировать поле и сохранять в sessionStorage пользователя.
//   private currentUser: string = 'User';

import { Subscriber } from '../types';

//   public getCurrentUser(): string {
//     this.currentUser = '';
//     return this.currentUser;
//   }
// }

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
