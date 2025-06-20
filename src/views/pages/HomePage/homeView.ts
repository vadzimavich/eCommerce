import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { HomeModel } from './homeModel';
import * as sectionContent from './constant-content';

export class HomeView {
  private readonly pageContainer: HTMLElement;
  private readonly copyButton: HTMLButtonElement;
  private readonly buttonToAbout: HTMLButtonElement;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: HomeModel
  ) {
    this.pageContainer = elementCreator(document.createElement('div'), {
      classNames: ['home', 'page-wrapper'],
    });
    this.copyButton = elementCreator(document.createElement('button'), {
      classNames: ['button', 'form__button', 'discount__btn'],
      content: 'Copy',
    });
    this.buttonToAbout = elementCreator(document.createElement('button'), {
      classNames: ['button', 'form__button', 'desc__btn'],
      content: sectionContent.TitleSection.Button,
      attributes: {
        href: '',
      },
    });
  }

  public render(): HTMLElement {
    const sectionTitle = this.buildTitleSection();
    const howSection = this.buildHowSection();
    const impactSection = this.buildImpactSection();

    this.pageContainer.append(sectionTitle, howSection, impactSection);
    return this.pageContainer;
  }

  public getCopyButton(): HTMLButtonElement {
    return this.copyButton;
  }

  public getButtonToAbout(): HTMLButtonElement {
    return this.buttonToAbout;
  }

  public updateCoppyButton(content: string): void {
    if (!content) {
      return;
    }
    this.copyButton.textContent = content;
  }

  public buildPromoSection(): void {
    const code = this.model.getPromoCode();
    if (!code) {
      return;
    }

    const sectionPromo = elementCreator(document.createElement('section'), {
      classNames: ['section', 'section__discount', 'discount'],
    });

    const promoBottom = elementCreator(document.createElement('div'), {
      classNames: ['discount__wrapper'],
    });

    const title = elementCreator(document.createElement('h3'), {
      classNames: ['discount__title'],
      content: sectionContent.DiscountSection.Title,
    });

    const promoCodeText = elementCreator(document.createElement('p'), {
      classNames: ['discount__code'],
    });
    promoCodeText.textContent = code;

    promoBottom.append(promoCodeText, this.copyButton);

    sectionPromo.append(title, promoBottom);
    this.pageContainer.append(sectionPromo);
  }

  private buildTitleSection(): HTMLElement {
    const section = elementCreator(document.createElement('section'), {
      classNames: ['section', 'section__title', 'title'],
    });
    const descContainer = elementCreator(document.createElement('div'), {
      classNames: ['section__title-desc', 'desc'],
    });
    const imgContainer = elementCreator(document.createElement('div'), {
      classNames: ['section__title-img', 'title-img'],
    });
    const img = elementCreator(document.createElement('img'), {
      classNames: ['title-img__img'],
      attributes: {
        src: './assets/home/home-bottle.webp',
        alt: 'img-bottle',
      },
    });
    imgContainer.append(img);
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['desc__title'],
      content: sectionContent.TitleSection.Title,
    });
    const subtitle = elementCreator(document.createElement('p'), {
      classNames: ['desc__subtitle'],
      content: sectionContent.TitleSection.Subtitle,
    });
    descContainer.append(title, subtitle, this.buttonToAbout);
    section.append(descContainer, imgContainer);
    return section;
  }

  private buildHowSection(): HTMLElement {
    const section = elementCreator(document.createElement('section'), {
      classNames: ['section', 'section__how', 'how'],
    });

    const title = elementCreator(document.createElement('h3'), {
      classNames: ['how__title'],
      content: sectionContent.HowSection.Title,
    });

    const list = elementCreator(document.createElement('ul'), {
      classNames: ['how__list'],
    });

    sectionContent.HowSection.Steps.forEach((item, index) => {
      const cart = elementCreator(document.createElement('li'), {
        classNames: ['how__item'],
      });
      const number = elementCreator(document.createElement('span'), {
        classNames: ['how__num'],
        content: (index + 1).toString(),
      });
      const text = elementCreator(document.createElement('p'), {
        classNames: ['how__text'],
        content: item,
      });
      cart.append(number, text);
      list.append(cart);
    });

    section.append(title, list);
    return section;
  }

  private buildImpactSection(): HTMLElement {
    const section = elementCreator(document.createElement('section'), {
      classNames: ['section', 'section__impact', 'impact'],
    });

    const title = elementCreator(document.createElement('h3'), {
      classNames: ['impact__title'],
      content: sectionContent.ImpactSection.Title,
    });

    const content = elementCreator(document.createElement('div'), {
      classNames: ['impact__content'],
    });

    const imageContainer = elementCreator(document.createElement('div'), {
      classNames: ['impact__image'],
    });

    const img = elementCreator(document.createElement('img'), {
      attributes: { src: './assets/home/home-impact.webp', alt: 'impact-img' },
    });

    imageContainer.append(img);

    const cards = elementCreator(document.createElement('div'), {
      classNames: ['impact__cards'],
    });

    sectionContent.ImpactSection.Cards.forEach(({ value, label }) => {
      const card = elementCreator(document.createElement('div'), {
        classNames: ['impact__card'],
      });
      const value_ = elementCreator(document.createElement('p'), {
        classNames: ['impact__value'],
        content: value,
      });
      const lbl = elementCreator(document.createElement('p'), {
        classNames: ['impact__label'],
        content: label,
      });
      card.append(value_, lbl);
      cards.append(card);
    });
    content.append(imageContainer, cards);

    section.append(title, content);
    return section;
  }
}
