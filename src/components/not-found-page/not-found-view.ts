import ElementCreator from '../../utils/dom-helpers';

export class NotFoundView {
  private readonly container: HTMLElement;
  private readonly buttonToHome: HTMLButtonElement;
  constructor() {
    this.container = ElementCreator.element({ classNames: ['page-wrapper'] });
    this.buttonToHome = ElementCreator.button({
      tag: 'button',
      classNames: ['btn', 'not-found__btn'],
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
    const wrapper = ElementCreator.element({ classNames: ['not-found__content'] });

    const title = ElementCreator.element({
      tag: 'h1',
      classNames: ['not-found__title'],
      content: '404',
    });

    const subtitle = ElementCreator.element({
      tag: 'p',
      classNames: ['not-found__subtitle'],
      content: 'Sorry, the page you are looking for does not exist.',
    });

    wrapper.append(title, subtitle, this.buttonToHome);
    return wrapper;
  }
}
