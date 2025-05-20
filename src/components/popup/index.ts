import { ModalController } from './popupController';
import { ModalView } from './popupView';

export class Modal {
  private static instance: Modal;
  private readonly view: ModalView;
  constructor() {
    this.view = new ModalView();
    new ModalController(this.view);
  }

  public static getInstance(): Modal {
    if (!Modal.instance) {
      Modal.instance = new Modal();
    }
    return Modal.instance;
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
