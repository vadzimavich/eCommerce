import { elementCreator } from '../../../../utils/dom-helpers';
import { EmailErrorTooltips } from './constant-content';

const addErrorTooltip = (input: HTMLInputElement, message: string): void => {
  const wrapper = input.closest('.reg__input__wrapper');

  if (wrapper instanceof HTMLElement) {
    const tooltip = elementCreator(document.createElement('div'), { classNames: ['error-tooltip'] });
    const tooltipMessage = elementCreator(document.createElement('p'), {
      classNames: ['error-tooltip__message'],
      content: message,
    });

    const lastChildIndex = wrapper.children.length;
    const lastChild = wrapper.children[lastChildIndex - 1];

    if (lastChild instanceof HTMLElement && lastChild.classList.contains('error-tooltip')) {
      lastChild.textContent = message;
    } else {
      const svg = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.15625C5.2203 2.15625 2.15625 5.2203 2.15625 9C2.15625 12.7797 5.2203 15.8438 9 15.8438C12.7797 15.8438 15.8438 12.7797 15.8438 9C15.8438 5.2203 12.7797 2.15625 9 2.15625ZM0.84375 9C0.84375 4.49543 4.49543 0.84375 9 0.84375C13.5046 0.84375 17.1562 4.49543 17.1562 9C17.1562 13.5046 13.5046 17.1562 9 17.1562C4.49543 17.1562 0.84375 13.5046 0.84375 9Z" fill="#F67804"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 8.34375C9.36244 8.34375 9.65625 8.63756 9.65625 9V12C9.65625 12.3624 9.36244 12.6562 9 12.6562C8.63756 12.6562 8.34375 12.3624 8.34375 12V9C8.34375 8.63756 8.63756 8.34375 9 8.34375Z" fill="#F67804"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.34375 6C8.34375 5.63756 8.63756 5.34375 9 5.34375H9.0075C9.36994 5.34375 9.66375 5.63756 9.66375 6C9.66375 6.36244 9.36994 6.65625 9.0075 6.65625H9C8.63756 6.65625 8.34375 6.36244 8.34375 6Z" fill="#F67804"/>
        </svg>
        `;

      tooltip.innerHTML = svg + tooltip.innerHTML;
      tooltip.append(tooltipMessage);
      wrapper.append(tooltip);
    }
  }
};

const removeErrorTooltip = (input: HTMLInputElement): void => {
  const wrapper = input.closest('.reg__input__wrapper');

  if (wrapper instanceof HTMLElement) {
    const lastChildIndex = wrapper.children.length;
    const lastChild = wrapper.children[lastChildIndex - 1];
    console.log('🚀 ~ removeErrorTooltip ~ lastChild:', lastChild);

    if (lastChild instanceof HTMLElement && lastChild.classList.contains('error-tooltip')) {
      lastChild.remove();
    }
  }
};

export const createInputEmail = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'email',
      type: 'email',
      id: id,
      placeholder: 'Your email address',
      autocomplete: 'email',
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const domainPart = value.split('@')[1];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.split(' ').length > 1) {
      addErrorTooltip(input, EmailErrorTooltips.Email_whitespace);
    } else if (!value.includes('@')) {
      addErrorTooltip(input, EmailErrorTooltips.Email_symbol);
    } else if (!domainPart || !domainPart.includes('.') || !(domainPart.split('.').length > 1)) {
      addErrorTooltip(input, EmailErrorTooltips.Email_domain);
    } else if (!regex.test(value)) {
      addErrorTooltip(input, EmailErrorTooltips.Email_format);
    } else {
      removeErrorTooltip(input);
    }
  });

  return input;
};

export const createInputPassword = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'password',
      type: 'password',
      id: id,
      placeholder: 'Create password',
      autocomplete: 'off',
      required: '',
    },
  });

  return input;
};

export const createInputFirstName = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'firstName',
      type: 'text',
      id: id,
      placeholder: 'Your First Name',
      autocomplete: 'given-name',
      required: '',
    },
  });

  return input;
};

export const createInputLastName = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'lastName',
      type: 'text',
      id: id,
      placeholder: 'Your Last Name',
      autocomplete: 'family-name',
      required: '',
    },
  });

  return input;
};

export const createInputBirthday = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'birthday',
      type: 'date',
      id: id,
      placeholder: '01.01.2000',
      autocomplete: 'birthday',
      required: '',
    },
  });

  return input;
};

export const createInputStreet = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'street',
      type: 'text',
      id: id,
      placeholder: 'Street',
      autocomplete: 'text',
      required: '',
    },
  });

  return input;
};

export const createInputCity = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'city',
      type: 'text',
      id: id,
      placeholder: 'City',
      autocomplete: 'city',
      required: '',
    },
  });

  return input;
};

export const createSelectCountry = (id: string, values: string[]): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'country',
      type: 'select',
      id: id,
      placeholder: 'Select Country',
      autocomplete: 'off',
      required: '',
    },
  });

  if (values) {
    values.forEach((item) => {
      const option = elementCreator(document.createElement('option'), {
        attributes: {
          value: item,
        },
        content: item[0].toUpperCase() + item.slice(1),
      });

      select.append(option);
    });
  }

  return select;
};

export const createInputPostalCode = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'postal-code',
      type: 'text',
      id: id,
      placeholder: '42142',
      autocomplete: 'postal-code',
      required: '',
    },
  });

  return input;
};
