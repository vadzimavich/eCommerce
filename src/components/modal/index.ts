import { ModalController } from './modalController';
import { ModalView } from './modalView';

export class Modal {
  private readonly view: ModalView;
  constructor() {
    this.view = new ModalView();
    new ModalController(this.view);
  }

  public errorMessage(message: string): void {
    this.view.renderError(message);
  }

  public infoMessage(message: string): void {
    this.view.renderInfo(message);
  }

  public remove(): void {
    this.view.remove();
  }
}
