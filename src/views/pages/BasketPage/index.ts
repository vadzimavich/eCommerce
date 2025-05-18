export class CartPage {
  public render(): HTMLElement {
    const container = document.createElement('div');
    // Заглушка класс для страниц потом удалим
    container.classList.add('plug');
    container.innerHTML = 'cartPage';

    return container;
  }
}
