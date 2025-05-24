export class HomePage {
  public render(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('plug');
    container.innerHTML = 'homePage';

    return container;
  }
}
