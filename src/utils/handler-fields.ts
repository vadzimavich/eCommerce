import { EmailErrorTooltips, PasswordErrorTooltips } from '../views/pages/RegistrationPage/View/constant-content';
import { addErrorTooltip, removeErrorTooltip } from './error-tooltip';

export const handlerEmailField = (input: HTMLInputElement): void => {
  const value = input.value;
  const domainPart = value.split('@')[1];
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.trim() !== value || value.split(' ').length > 1) {
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
};

export const handlerPasswordField = (input: HTMLInputElement): void => {
  const value = input.value;
  const regexNumber = /(?=.*[0-9])/;
  const regexLowerLetter = /(?=.*[a-z])/;
  const regexUpperLetter = /^(?=.*[A-Z])/;
  const regexSymbol = /(?=.*[!@#$%^&*])/;

  if (value.trim() !== value || value.split(' ').length > 1) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_whitespace);
  } else if (value.length < 8) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_length);
  } else if (!regexNumber.test(value)) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_number);
  } else if (!regexLowerLetter.test(value)) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_lower_letter);
  } else if (!regexUpperLetter.test(value)) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_upper_letter);
  } else if (!regexSymbol.test(value)) {
    addErrorTooltip(input, PasswordErrorTooltips.Password_symbol);
  } else {
    removeErrorTooltip(input);
  }
};
