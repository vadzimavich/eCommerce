import {
  DateErrorTooltips,
  EmailErrorTooltips,
  NameErrorTooltips,
  PasswordErrorTooltips,
  PostalCodeErrorTooltips,
} from '../views/pages/RegistrationPage/View/constant-content';
import { addErrorTooltip, removeErrorTooltip } from './error-tooltip';
import { calculateAge } from './helpers';

export const handlerEmailField = (input: HTMLInputElement): void => {
  const value = input.value;
  const domainPart = value.split('@')[1];
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.trim() !== value || value.split(' ').length > 1) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, EmailErrorTooltips.Email_whitespace);
  } else if (!value.includes('@')) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, EmailErrorTooltips.Email_symbol);
  } else if (!domainPart || !domainPart.includes('.') || !(domainPart.split('.').length > 1)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, EmailErrorTooltips.Email_domain);
  } else if (!regex.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, EmailErrorTooltips.Email_format);
  } else {
    removeErrorTooltip(input);
    input.setAttribute('data-correct', 'true');
  }
};

export const handlerPasswordField = (input: HTMLInputElement): void => {
  const value = input.value;
  const regexNumber = /(?=.*[0-9])/;
  const regexLowerLetter = /(?=.*[a-z])/;
  const regexUpperLetter = /^(?=.*[A-Z])/;
  const regexSymbol = /(?=.*[!@#$%^&*])/;

  if (value.trim() !== value || value.split(' ').length > 1) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_whitespace);
  } else if (value.length < 8) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_length);
  } else if (!regexNumber.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_number);
  } else if (!regexLowerLetter.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_lower_letter);
  } else if (!regexUpperLetter.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_upper_letter);
  } else if (!regexSymbol.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, PasswordErrorTooltips.Password_symbol);
  } else {
    removeErrorTooltip(input);
    input.setAttribute('data-correct', 'true');
  }
};

export const handlerNameField = (input: HTMLInputElement): void => {
  const value = input.value;

  const regex = /^[a-zA-Z]+$/;

  if (value.length < 1) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, NameErrorTooltips.Name_length);
  } else if (!regex.test(value)) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, NameErrorTooltips.Name_value);
  } else {
    removeErrorTooltip(input);
    input.setAttribute('data-correct', 'true');
  }
};

export const handlerLengthField = (input: HTMLInputElement): void => {
  const value = input.value;

  if (value.length < 1) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, NameErrorTooltips.Name_length);
  } else {
    removeErrorTooltip(input);
    input.setAttribute('data-correct', 'true');
  }
};

export const handlerDateField = (input: HTMLInputElement): void => {
  const value = input.value;

  const old = calculateAge(new Date(value));

  if (new Date(value).getFullYear() < 1990) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, DateErrorTooltips.Date_before);
  } else if (old < 0) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, DateErrorTooltips.Date_future);
  } else if (old < 13) {
    input.setAttribute('data-correct', 'false');
    addErrorTooltip(input, DateErrorTooltips.Date_old);
  } else {
    removeErrorTooltip(input);
    input.setAttribute('data-correct', 'true');
  }
};

export const handlerPostalCodeField = (input: HTMLInputElement): void => {
  const value = input.value;

  const wrapper = input.closest('.reg__inputs__wrapper');

  if (wrapper instanceof HTMLElement) {
    const county = wrapper.querySelector('select[name="country"]');
    if (county instanceof HTMLSelectElement) {
      if (county.value === 'USA') {
        const regex = /^\d{5}(-\d{4})?$/;

        if (!regex.test(value)) {
          input.setAttribute('data-correct', 'false');
          addErrorTooltip(input, PostalCodeErrorTooltips.Postal_code_USA);
        } else {
          input.setAttribute('data-correct', 'true');
          removeErrorTooltip(input);
        }
      } else if (county.value === 'Canada') {
        const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

        if (!regex.test(value)) {
          input.setAttribute('data-correct', 'false');
          addErrorTooltip(input, PostalCodeErrorTooltips.Postal_code_Canada);
        } else {
          input.setAttribute('data-correct', 'true');
          removeErrorTooltip(input);
        }
      }
    }
  }
};

export const handlerCountryField = (select: HTMLSelectElement): void => {
  const value = select.value;

  const wrapper = select.closest('.reg__inputs__wrapper');

  if (wrapper instanceof HTMLElement) {
    const postalCode = wrapper.querySelector('input[name="postal-code"]');
    if (postalCode instanceof HTMLInputElement) {
      if (value === 'USA') {
        const regex = /^\d{5}(-\d{4})?$/;

        if (!regex.test(postalCode.value)) {
          postalCode.setAttribute('data-correct', 'false');
          addErrorTooltip(postalCode, PostalCodeErrorTooltips.Postal_code_USA);
        } else {
          postalCode.setAttribute('data-correct', 'true');
          removeErrorTooltip(postalCode);
        }
      } else if (value === 'Canada') {
        const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

        if (!regex.test(postalCode.value)) {
          postalCode.setAttribute('data-correct', 'false');
          addErrorTooltip(postalCode, PostalCodeErrorTooltips.Postal_code_Canada);
        } else {
          postalCode.setAttribute('data-correct', 'true');
          removeErrorTooltip(postalCode);
        }
      }
    }
  }
};
