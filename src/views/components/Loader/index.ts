import { elementCreator } from '../../../utils/dom-helpers';

export const loaderView = (): HTMLElement => {
  const container = elementCreator(document.createElement('div'), { classNames: ['loader'] });

  const img = elementCreator(document.createElement('img'), {
    classNames: ['loader__img'],
    attributes: { src: './assets/icons/loader.svg' },
  });

  container.append(img);
  return container;
};
