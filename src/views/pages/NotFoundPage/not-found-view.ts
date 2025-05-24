import { elementCreator } from '../../../utils/dom-helpers';

export class NotFoundView {
  private readonly container: HTMLElement;
  private readonly buttonToHome: HTMLButtonElement;
  constructor() {
    this.container = elementCreator(document.createElement('div'), {
      classNames: ['page-wrapper', 'not-found__page'],
    });
    this.buttonToHome = elementCreator(document.createElement('button'), {
      classNames: ['button', 'not-found__button'],
      content: 'Go to HomePage',
    });
  }

  public getButtonToHome(): HTMLButtonElement {
    return this.buttonToHome;
  }

  public render(): HTMLElement {
    const content = this.buildInformContent();
    this.container.append(content);
    return this.container;
  }

  private buildInformContent(): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['not-found__content'] });

    const title = elementCreator(document.createElement('h1'), {
      classNames: ['not-found__title'],
      content: '404',
    });

    const subtitle = elementCreator(document.createElement('p'), {
      classNames: ['not-found__subtitle'],
      content: 'Sorry, the page you are looking for does not exist.',
    });

    wrapper.append(title, subtitle, this.buttonToHome);
    return wrapper;
  }
}
