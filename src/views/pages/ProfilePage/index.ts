export class ProfilePage {
  public render(): HTMLElement {
    const container = document.createElement('div');
    // Заглушка класс для страниц потом удалим
    container.classList.add('plug');
    container.innerHTML = 'profilePage';

    return container;
  }
}
