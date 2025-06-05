import { elementCreator } from './dom-helpers';
import { updateTooltip } from './error-tooltip';
import {
  handlerEmailField,
  handlerPasswordField,
  handlerNameField,
  handlerRequiredField,
  handlerDateField,
  handlerPostalCodeField,
} from './handler-fields';
import { getCurrentDateInStringFormat } from './formatters';

export const createInputEmail = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'email',
      type: 'email',
      id: id,
      placeholder: 'Your email address',
      autocomplete: 'email',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerEmailField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputPassword = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'password',
      type: 'password',
      id: id,
      placeholder: 'Create password',
      autocomplete: 'new-password',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerPasswordField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputFirstName = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'firstName',
      type: 'text',
      id: id,
      placeholder: 'Your First Name',
      autocomplete: 'given-name',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerNameField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputLastName = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'lastName',
      type: 'text',
      id: id,
      placeholder: 'Your Last Name',
      autocomplete: 'family-name',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerNameField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputBirthday = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'bday',
      type: 'date',
      id: id,
      min: '1900-01-01',
      max: getCurrentDateInStringFormat(),
      autocomplete: 'bday',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerDateField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputStreet = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'street',
      type: 'text',
      id: id,
      placeholder: 'Street',
      autocomplete: 'street-address',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerRequiredField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createInputCity = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'city',
      type: 'text',
      id: id,
      placeholder: 'City',
      autocomplete: 'address-level2',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const resultHandler = handlerNameField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

// eslint-disable-next-line max-lines-per-function
export const createSelectCountry = (id: string, countryNames: string[]): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input'],
    attributes: {
      name: 'country',
      id: id,
      'data-correct': 'true',
      required: '',
    },
  });

  const countryCodeMap: Record<string, string> = {
    USA: 'US',
    Canada: 'CA',
  };

  countryNames.forEach((displayName) => {
    const countryCode = countryCodeMap[displayName] || displayName;
    const option = elementCreator(document.createElement('option'), {
      attributes: {
        value: countryCode,
      },
      content: displayName,
    });
    select.append(option);
  });

  if (select.options.length > 0) {
    select.value = select.options[0].value;
  }

  select.addEventListener('change', () => {
    select.setAttribute('data-correct', 'true');
    updateTooltip(select, { result: true });

    const formContainer = select.closest('.profile-page__address-form') || select.closest('.form');
    if (formContainer) {
      const postalCodeInput = formContainer.querySelector<HTMLInputElement>('input[name="postal-code"]');
      if (postalCodeInput) {
        postalCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        console.warn(`Postal code input not found relative to country select ID: ${id} within form.`);
      }
    } else {
      console.warn(`Form container not found for country select ID: ${id}`);
    }
  });
  select.setAttribute('data-correct', 'true');
  return select;
};

export const createInputPostalCode = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'postal-code',
      type: 'text',
      id: id,
      placeholder: '12345 or A1B 2C3',
      autocomplete: 'postal-code',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;
    const formContainer = input.closest('.profile-page__address-form') || input.closest('.form');
    let countryCode = '';

    if (formContainer) {
      const countrySelect = formContainer.querySelector<HTMLSelectElement>('select[name="country"]');
      if (countrySelect instanceof HTMLSelectElement) {
        countryCode = countrySelect.value;
      } else {
        console.warn(`Country select not found for postal code validation (ID: ${id})`);
      }
    } else {
      console.warn(`Form container not found for postal code ID: ${id}`);
    }
    const resultHandler = handlerPostalCodeField(countryCode, value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};
