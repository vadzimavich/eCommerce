import { ModalController } from './modalController';
import { ModalView } from './modalView';

export class Modal {
  private readonly view: ModalView;
  constructor() {
    this.view = new ModalView();
  }
  public init(message: string): void {
    new ModalController(this.view);
    this.view.render(message);
  }
}
