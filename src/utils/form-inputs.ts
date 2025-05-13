import { elementCreator } from './dom-helpers';
import * as handlerField from './handler-fields';

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
    handlerField.handlerEmailField(input);
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
      pattern: `^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$`,
      required: '',
    },
  });

  input.addEventListener('input', () => {
    handlerField.handlerPasswordField(input);
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
      pattern: '^[a-zA-Z]+$',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    handlerField.handlerNameField(input);
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

  input.addEventListener('input', () => {
    handlerField.handlerNameField(input);
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
      min: '1900-01-01',
      placeholder: '01.01.2000',
      autocomplete: 'birthday',
      required: '',
    },
  });

  input.addEventListener('input', () => {
    handlerField.handlerDateField(input);
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

  input.addEventListener('input', () => {
    handlerField.handlerLengthField(input);
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

  input.addEventListener('input', () => {
    handlerField.handlerNameField(input);
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

  input.addEventListener('input', () => {
    handlerField.handlerPostalCodeField(input);
  });

  return input;
};
