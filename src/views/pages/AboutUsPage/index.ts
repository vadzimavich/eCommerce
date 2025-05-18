export class AboutPage {
  public render(): HTMLElement {
    const container = document.createElement('div');
    // Заглушка класс для страниц потом удалим
    container.classList.add('plug');
    container.innerHTML = 'aboutPage';

    return container;
  }
}
