import { Button, DivElementOptions } from '../models/types/domElements-type';

export function createButton({ id, text, classes, disabled = false, attributes = {} }: Button): HTMLButtonElement {
  const button = document.createElement('button');
  if (id) {
    button.id = id;
  }
  button.textContent = text;
  if (classes.length > 0) {
    button.classList.add(...classes);
  }
  !disabled ? (button.disabled = false) : (button.disabled = true);

  Object.entries(attributes).forEach(([key, value]) => {
    button.setAttribute(key, String(value));
  });

  return button;
}

export const createDivElement = (options: DivElementOptions): HTMLDivElement => {
  const { id, text = '', children = [], classes = [], attributes = {} } = options;
  const element = document.createElement('div');
  element.textContent = text;

  if (id) {
    element.id = id;
  }

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  element.append(...children);
  return element;
};
