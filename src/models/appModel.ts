export class AppModel {
  // NOTE: Это тестовое поле для проверки роутинга и доступа для авторизированного и не авторизированного пользователя. В будущем планируем типизировать поле и сохранять в sessionStorage пользователя.
  private currentUser: string = 'User';

  public getCurrentUser(): string {
    this.currentUser = '';
    return this.currentUser;
  }
}
