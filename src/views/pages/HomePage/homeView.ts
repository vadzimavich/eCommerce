import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { HomeModel } from './homeModel';

export class HomeView {
  private readonly pageContainer: HTMLElement;
  private readonly copyButton: HTMLButtonElement;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: HomeModel
  ) {
    this.pageContainer = elementCreator(document.createElement('div'), {
      classNames: ['page-wrapper', 'home'],
    });
    this.copyButton = elementCreator(document.createElement('button'), {
      classNames: ['button', 'form__button', 'discount__btn'],
      content: 'Copy',
    });
  }

  public render(): HTMLElement {
    return this.pageContainer;
  }

  public getCoppyButton(): HTMLButtonElement {
    return this.copyButton;
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
      classNames: ['discoun__text'],
      content: 'Use our promo code on your first purchase',
    });

    const promoCodeText = elementCreator(document.createElement('p'), {
      classNames: ['discount__code'],
    });
    promoCodeText.textContent = code;

    promoBottom.append(promoCodeText, this.copyButton);

    sectionPromo.append(text, promoBottom);
    this.pageContainer.append(sectionPromo);
  }
}
