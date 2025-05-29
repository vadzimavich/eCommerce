import { elementCreator } from './dom-helpers';
import { updateTooltip } from './error-tooltip';
import { getCurrentDateInStringFormat } from './formatters';
import * as handlerField from './handler-fields';

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
    const resultHandler = handlerField.handlerEmailField(value);

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
    const resultHandler = handlerField.handlerPasswordField(value);

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
    const resultHandler = handlerField.handlerNameField(value);

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
    const resultHandler = handlerField.handlerNameField(value);

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
    const resultHandler = handlerField.handlerDateField(value);

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
    const resultHandler = handlerField.handlerRequiredField(value);

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
    const resultHandler = handlerField.handlerNameField(value);

    input.setAttribute('data-correct', resultHandler.result.toString());
    updateTooltip(input, resultHandler);
  });

  return input;
};

export const createSelectCountry = (id: string, values: string[]): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input'],
    attributes: {
      name: 'country',
      type: 'select',
      id: id,
      'data-correct': 'true',
      required: '',
    },
  });

  values.forEach((item) => {
    const option = elementCreator(document.createElement('option'), {
      attributes: {
        value: item,
      },
      content: item[0].toUpperCase() + item.slice(1),
    });

    select.append(option);
  });

  select.addEventListener('change', () => {
    const value = select.value;
    const wrapper = select.closest('.form__inputs__wrapper');

    if (wrapper instanceof HTMLElement) {
      const postalCode = wrapper.querySelector('input[name="postal-code"]');
      if (postalCode instanceof HTMLInputElement) {
        const resultHandler = handlerField.handlerPostalCodeField(value, postalCode.value);
        postalCode.setAttribute('data-correct', resultHandler.result.toString());
        updateTooltip(postalCode, resultHandler);
      }
    }
  });

  return select;
};

export const createInputPostalCode = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['form__input'],
    attributes: {
      name: 'postal-code',
      type: 'text',
      id: id,
      placeholder: '12345',
      autocomplete: 'postal-code',
      'data-correct': 'false',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    const value = input.value;

    const wrapper = input.closest('.form__inputs__wrapper');
    if (wrapper instanceof HTMLElement) {
      const county = wrapper.querySelector('select[name="country"]');
      if (county instanceof HTMLSelectElement) {
        const resultHandler = handlerField.handlerPostalCodeField(county.value, value);

        input.setAttribute('data-correct', resultHandler.result.toString());
        updateTooltip(input, resultHandler);
      }
    }
  });

  return input;
};

export const createSelectCatalogSort = (id: string, optoins: string[], values: string[]): HTMLSelectElement => {
  const select = elementCreator(document.createElement('select'), {
    classNames: ['form__input', 'catalog-right__head-sort'],
    attributes: {
      name: 'sort',
      type: 'select',
      id: id,
      required: '',
    },
  });

  optoins.forEach((item, index) => {
    const option = elementCreator(document.createElement('option'), {
      attributes: {
        value: values[index],
      },
      content: item[0].toUpperCase() + item.slice(1),
    });
    select.append(option);
  });
  return select;
};
