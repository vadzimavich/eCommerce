import { elementCreator } from '../../utils/dom-helpers';

export class ModalView {
  public readonly button: HTMLButtonElement;
  private readonly modal: HTMLDialogElement;

  constructor() {
    this.modal = elementCreator(document.createElement('dialog'), { classNames: ['modal'] });
    this.button = elementCreator(document.createElement('button'), {
      classNames: ['modal__button_close', 'button'],
      content: 'OK',
    });
  }

  public render(message: string): HTMLDialogElement {
    this.build(message);
    document.body.append(this.modal);
    this.modal.showModal();

    return this.modal;
  }

  public remove(): void {
    this.modal.remove();
  }

  private build(message: string): void {
    const content = elementCreator(document.createElement('div'), { classNames: ['modal__content'], content: message });

    this.modal.append(content, this.button);
  }
}
