import { MemberData } from '../../../../models/types/common-types';
import { elementCreator } from '../../../../utils/dom-helpers';
import { ButtonDesc } from './content';
import { MemberController } from './member-controller';

export class Member {
  public readonly buttonReadMore: HTMLButtonElement;
  public readonly description: HTMLParagraphElement;
  private readonly container: HTMLElement;

  constructor(private readonly data: MemberData) {
    this.container = elementCreator(document.createElement('li'), {
      classNames: ['member'],
    });

    this.description = elementCreator(document.createElement('p'), {
      classNames: ['description'],
      content: this.data.description,
    });

    this.buttonReadMore = elementCreator(document.createElement('button'), {
      classNames: ['button'],
      content: ButtonDesc.Read,
    });
    new MemberController(this.buttonReadMore, this.description);
  }

  public render(): HTMLElement {
    this.addImage();
    this.addContentInfo();
    return this.container;
  }

  private addImage(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['img__wrapper'],
    });

    const img = elementCreator(document.createElement('img'), {
      classNames: ['img'],
      attributes: {
        src: this.data.image,
      },
    });

    wrapper.append(img);
    this.container.append(wrapper);
  }

  private addContentInfo(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['content_wrapper', 'wrapper'],
    });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['title'],
      content: this.data.name,
    });

    const roles = elementCreator(document.createElement('div'), {
      classNames: ['roles'],
      content: this.data.roles[0] + ' / ' + this.data.roles[1],
    });

    const wrapperButton = elementCreator(document.createElement('div'), {
      classNames: ['button__wrapper'],
    });

    const link = elementCreator(document.createElement('a'), {
      classNames: ['link'],
      attributes: {
        href: this.data.gitHub,
        target: '_blank',
      },
    });

    wrapperButton.append(this.buttonReadMore);
    wrapper.append(title, roles, this.description, wrapperButton, this.createContribution(), link);
    this.container.append(wrapper);
  }

  private createContribution(): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['contribution__wrapper'],
    });

    const subtitle = elementCreator(document.createElement('h3'), {
      classNames: ['contribution__subtitle'],
      content: 'Contribution',
    });

    const list = elementCreator(document.createElement('ul'), {
      classNames: ['contribution__list'],
    });

    this.data.contribution.forEach((item) => {
      const contribution = elementCreator(document.createElement('li'), {
        classNames: ['contribution__item'],
        content: item,
      });

      list.append(contribution);
    });

    wrapper.append(subtitle, list);
    return wrapper;
  }
}
