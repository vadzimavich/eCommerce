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

  public renderError(message: string): HTMLDialogElement {
    this.addMessage(message);
    this.modal.append(this.button);
    document.body.append(this.modal);
    this.modal.showModal();

    return this.modal;
  }

  public renderInfo(message: string): HTMLDialogElement {
    this.addMessage(message);
    document.body.append(this.modal);
    this.modal.classList.add('modal-info');
    this.modal.show();

    setTimeout(() => {
      this.remove();
      this.modal.classList.remove('modal-info');
    }, 2000);

    return this.modal;
  }

  public remove(): void {
    this.modal.close();
    Array.from(this.modal.children).forEach((element) => element.remove());
    this.modal.remove();
  }

  private addMessage(message: string): void {
    const content = elementCreator(document.createElement('div'), { classNames: ['modal__content'], content: message });

    this.modal.append(content);
  }
}
