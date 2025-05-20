import { ModalView } from './modalView';

export class ModalController {
  constructor(private readonly view: ModalView) {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.view.button.addEventListener('click', () => {
      this.view.remove();
    });
  }
}
