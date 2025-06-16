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
      classNames: ['page-wrapper'],
    });
    this.copyButton = elementCreator(document.createElement('button'), {
      classNames: ['button', 'btn', 'promo-copy'],
      content: 'Copy',
    });
  }

  public render(): HTMLElement {
    return this.pageContainer;
  }

  public buildPromoContainer(): void {
    const code = this.model.getPromoCode();
    if (!code) {
      return;
    }

    const promoBlock = elementCreator(document.createElement('div'), {
      classNames: ['promo-block'],
    });

    const promoBottom = elementCreator(document.createElement('div'));

    const text = elementCreator(document.createElement('p'), {
      classNames: ['promo-text'],
      content: 'Use our promo code on your first purchase',
    });

    const promoCodeText = elementCreator(document.createElement('p'), {});
    promoCodeText.textContent = code;

    promoBottom.append(promoCodeText, this.copyButton);

    promoBlock.append(text, promoBottom);
    this.pageContainer.append(promoBlock);
  }
}
