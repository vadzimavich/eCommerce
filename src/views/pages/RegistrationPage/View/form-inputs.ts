import { elementCreator } from '../../../../utils/dom-helpers';

export const createInputEmail = (id: string): HTMLInputElement => {
  const input = elementCreator(document.createElement('input'), {
    classNames: ['reg__input'],
    attributes: {
      name: 'email',
      type: 'email',
      id: id,
      placeholder: 'Your email address',
      autocomplete: 'email',
      required: '',
    },
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
