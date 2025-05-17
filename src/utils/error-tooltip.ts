import { HandlerInputFieldResult } from '../models/types/common-types';
import { elementCreator } from './dom-helpers';

const addErrorTooltip = (input: HTMLInputElement, message: string): void => {
  const wrapper = input.closest('.reg__input__wrapper');

  if (wrapper instanceof HTMLElement) {
    const lastChildIndex = wrapper.children.length;
    const lastChild = wrapper.children[lastChildIndex - 1];

    if (lastChild instanceof HTMLElement && lastChild.classList.contains('error-tooltip')) {
      changeMessageTooltip(lastChild, message);
    } else {
      const tooltip = createTooltip(message);
      wrapper.append(tooltip);
    }
  }
};

const removeErrorTooltip = (input: HTMLInputElement): void => {
  const wrapper = input.closest('.reg__input__wrapper');

  if (wrapper instanceof HTMLElement) {
    const lastChildIndex = wrapper.children.length;
    const lastChild = wrapper.children[lastChildIndex - 1];

    if (lastChild instanceof HTMLElement && lastChild.classList.contains('error-tooltip')) {
      lastChild.remove();
    }
  }
};

const createTooltip = (message: string): HTMLElement => {
  const tooltip = elementCreator(document.createElement('div'), { classNames: ['error-tooltip'] });
  const tooltipMessage = elementCreator(document.createElement('p'), {
    classNames: ['error-tooltip__message'],
    content: message,
  });
  const svg = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.15625C5.2203 2.15625 2.15625 5.2203 2.15625 9C2.15625 12.7797 5.2203 15.8438 9 15.8438C12.7797 15.8438 15.8438 12.7797 15.8438 9C15.8438 5.2203 12.7797 2.15625 9 2.15625ZM0.84375 9C0.84375 4.49543 4.49543 0.84375 9 0.84375C13.5046 0.84375 17.1562 4.49543 17.1562 9C17.1562 13.5046 13.5046 17.1562 9 17.1562C4.49543 17.1562 0.84375 13.5046 0.84375 9Z" fill="#F67804"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 8.34375C9.36244 8.34375 9.65625 8.63756 9.65625 9V12C9.65625 12.3624 9.36244 12.6562 9 12.6562C8.63756 12.6562 8.34375 12.3624 8.34375 12V9C8.34375 8.63756 8.63756 8.34375 9 8.34375Z" fill="#F67804"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.34375 6C8.34375 5.63756 8.63756 5.34375 9 5.34375H9.0075C9.36994 5.34375 9.66375 5.63756 9.66375 6C9.66375 6.36244 9.36994 6.65625 9.0075 6.65625H9C8.63756 6.65625 8.34375 6.36244 8.34375 6Z" fill="#F67804"/>
    </svg>
    `;

  tooltip.innerHTML = svg + tooltip.innerHTML;
  tooltip.append(tooltipMessage);

  return tooltip;
};

const changeMessageTooltip = (tooltip: HTMLElement, message: string): void => {
  const content = tooltip.children[1];

  content.textContent = message;
};

export const updateTooltip = (element: HTMLInputElement, resultHandler: HandlerInputFieldResult): void => {
  if (!resultHandler.result && resultHandler.errorMessage) {
    addErrorTooltip(element, resultHandler.errorMessage);
  } else {
    removeErrorTooltip(element);
  }
};
