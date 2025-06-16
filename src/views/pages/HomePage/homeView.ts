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
      classNames: ['home'],
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
    this.pageContainer.append(sectionTitle);
    return this.pageContainer;
  }

  public getCoppyButton(): HTMLButtonElement {
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

    const text = elementCreator(document.createElement('p'), {
      classNames: ['discount__text'],
      content: sectionContent.DiscountSection.Title,
    });

    const promoCodeText = elementCreator(document.createElement('p'), {
      classNames: ['discount__code'],
    });
    promoCodeText.textContent = code;

    promoBottom.append(promoCodeText, this.copyButton);

    sectionPromo.append(text, promoBottom);
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
}
