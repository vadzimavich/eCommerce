import { ElementParameters } from '../models/types/domElements-type';

export const elementCreator = <T extends HTMLElement>(element: T, parameters?: ElementParameters): T => {
  if (parameters) {
    if (parameters.classNames) {
      parameters.classNames.forEach((className) => element.classList.add(className));
    }

    if (parameters.attributes) {
      const keys = Object.keys(parameters.attributes);
      keys.forEach((key) => {
        if (parameters.attributes) {
          const value = parameters.attributes[key];
          if (value !== undefined) {
            element.setAttribute(key, value);
          }
        }
      });
    }

    if (parameters.content) {
      element.textContent = parameters.content;
    }
  }

  return element;
};
