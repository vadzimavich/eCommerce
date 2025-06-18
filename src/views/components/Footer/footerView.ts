import { AppModel } from '../../../models/state/AppState';
import { InfoBlockParameters, InfoItem } from '../../../models/types/content-block';
import { elementCreator } from '../../../utils/dom-helpers';
import * as content from './constant-content';
import { FooterModel } from './footerModel';

export class FooterView {
  private readonly footer: HTMLElement;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: FooterModel
  ) {
    this.footer = elementCreator(document.createElement('footer'), { classNames: ['footer'] });
  }

  public render(): HTMLElement {
    const topTitle = elementCreator(document.createElement('div'), { classNames: ['footer', 'footer__top'] });
    const benifist = this.builInfoBlock(content.benefits);
    const categories = this.buildCategories();
    const team = this.builInfoBlock(content.team);
    topTitle.append(benifist, categories, team);
    this.footer.append(topTitle);
    return this.footer;
  }

  public updateRender(): void {
    this.footer.replaceChildren();
    this.render();
  }

  private buildCategories(): HTMLElement {
    const categories = this.model.getCategories();
    const container = elementCreator(document.createElement('div'), {
      classNames: ['categories'],
    });
    if (!categories || !categories.length) {
      return container;
    }

    const title = elementCreator(document.createElement('h4'), {
      classNames: ['categories__title'],
      content: 'Categories',
    });

    const list = elementCreator(document.createElement('ul'), {
      classNames: ['categories__list'],
    });

    categories.forEach((item) => {
      const li = elementCreator(document.createElement('li'), {
        classNames: ['categories__item'],
      });

      const link = elementCreator(document.createElement('a'), {
        classNames: ['categories__link'],
        attributes: {
          href: `#/catalog/${item.name.toLocaleLowerCase()}`,
        },
        content: item.name,
      });

      li.append(link);
      list.append(li);
    });

    container.append(title, list);
    return container;
  }

  private builInfoBlock({ title, items, baseClass }: InfoBlockParameters): HTMLElement {
    const container = elementCreator(document.createElement('div'), {
      classNames: [baseClass],
    });
    const titleElement = elementCreator(document.createElement('h4'), {
      classNames: [`${baseClass}__title`],
      content: title,
    });

    const list = elementCreator(document.createElement('ul'), {
      classNames: [`${baseClass}__list`],
    });

    items.forEach((item) => {
      const li = elementCreator(document.createElement('li'), {
        classNames: [`${baseClass}__item`],
      });

      const icon = elementCreator(document.createElement('img'), {
        classNames: [`${baseClass}__icon`],
        attributes: { src: item.src, alt: 'footer-icon' },
      });

      li.append(icon);

      const labelElement = this.createInfoLabelElement(item, baseClass);
      li.append(icon, labelElement);
      if (item.desc) {
        const desc = elementCreator(document.createElement('span'), {
          classNames: [`${baseClass}__desc`],
          content: item.desc,
        });
        li.append(desc);
      }
      list.append(li);
    });
    container.append(titleElement, list);
    return container;
  }

  private createInfoLabelElement(item: InfoItem, baseClass: string): HTMLElement {
    if (item.href) {
      return elementCreator(document.createElement('a'), {
        classNames: [`${baseClass}__label`],
        attributes: {
          href: item.href,
          target: '_blank',
        },
        content: item.label,
      });
    }

    return elementCreator(document.createElement('p'), {
      classNames: [`${baseClass}__text`],
      content: item.label,
    });
  }
}
