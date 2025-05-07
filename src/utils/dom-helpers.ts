import { CustomHTMLElement, ElementParameters } from '../models/types/domElements-type';

class ElementCreator {
  public static element(parameters: ElementParameters): HTMLElement {
    const { tag = 'div' } = parameters;
    const element = document.createElement(tag);
    ElementCreator.addParametersForElement(element, parameters);

    return element;
  }

  public static button(parameters: ElementParameters): HTMLButtonElement {
    const element = document.createElement('button');
    ElementCreator.addParametersForElement(element, parameters);

    return element;
  }

  public static anchor(parameters: ElementParameters): HTMLAnchorElement {
    const element = document.createElement('a');
    ElementCreator.addParametersForElement(element, parameters);

    return element;
  }

  public static input(parameters: ElementParameters): HTMLInputElement {
    const element = document.createElement('input');
    ElementCreator.addParametersForElement(element, parameters);

    return element;
  }

  private static addParametersForElement(element: CustomHTMLElement, parameters: ElementParameters): void {
    if (parameters.classNames) {
      parameters.classNames.forEach((className) => element.classList.add(className));
    }

    if (parameters.attributes) {
      const keys = Object.keys(parameters.attributes);
      keys.forEach((key) => {
        const value = parameters.attributes?.[key];
        if (value !== undefined) {
          element.setAttribute(key, value);
        }
      });
    }

    if (parameters.content) {
      element.textContent = parameters.content;
    }
  }
}

export default ElementCreator;
