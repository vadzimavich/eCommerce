export class AboutPage {
  public render(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('plug');
    container.innerHTML = 'aboutPage';

    return container;
  }
}
