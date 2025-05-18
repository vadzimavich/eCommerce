import { HandlerInputFieldResult } from '../models/types/common-types';
import {
  DateErrorTooltips,
  EmailErrorTooltips,
  NameErrorTooltips,
  PasswordErrorTooltips,
  PostalCodeErrorTooltips,
} from '../views/components/InputField/constants-content';
import { calculateAge } from './helpers';

export const handlerEmailField = (value: string): HandlerInputFieldResult => {
  const domainPart = value.split('@')[1];
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.trim() !== value || value.split(' ').length > 1) {
    return { result: false, errorMessage: EmailErrorTooltips.Email_whitespace };
  }

  if (!value.includes('@')) {
    return { result: false, errorMessage: EmailErrorTooltips.Email_symbol };
  }

  if (!domainPart || !domainPart.includes('.') || domainPart.split('.').length <= 1) {
    return { result: false, errorMessage: EmailErrorTooltips.Email_domain };
  }

  if (!regex.test(value)) {
    return { result: false, errorMessage: EmailErrorTooltips.Email_format };
  }

  return { result: true };
};

export const handlerPasswordField = (value: string): HandlerInputFieldResult => {
  const regexNumber = /(?=.*[0-9])/;
  const regexLowerLetter = /(?=.*[a-z])/;
  const regexUpperLetter = /^(?=.*[A-Z])/;
  const regexSymbol = /(?=.*[!@#$%^&*-])/;

  if (value.trim() !== value || value.split(' ').length > 1) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_whitespace };
  }

  if (value.length < 8) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_length };
  }

  if (!regexNumber.test(value)) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_number };
  }

  if (!regexLowerLetter.test(value)) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_lower_letter };
  }

  if (!regexUpperLetter.test(value)) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_upper_letter };
  }

  if (!regexSymbol.test(value)) {
    return { result: false, errorMessage: PasswordErrorTooltips.Password_symbol };
  }

  return { result: true };
};

export const handlerNameField = (value: string): HandlerInputFieldResult => {
  const regex = /^[a-zA-Z]+$/;

  if (value.length < 1) {
    return { result: false, errorMessage: NameErrorTooltips.Name_length };
  }

  if (!regex.test(value)) {
    return { result: false, errorMessage: NameErrorTooltips.Name_value };
  }

  return { result: true };
};

export const handlerRequiredField = (value: string): HandlerInputFieldResult => {
  if (value.length < 1) {
    return { result: false, errorMessage: NameErrorTooltips.Name_length };
  }

  return { result: true };
};

export const handlerDateField = (value: string): HandlerInputFieldResult => {
  const old = calculateAge(new Date(value));

  if (new Date(value).getFullYear() < 1990) {
    return { result: false, errorMessage: DateErrorTooltips.Date_before };
  }

  if (old < 0) {
    return { result: false, errorMessage: DateErrorTooltips.Date_future };
  }

  if (old < 13) {
    return { result: false, errorMessage: DateErrorTooltips.Date_old };
  }

  return { result: true };
};

export const handlerPostalCodeField = (country: string, value: string): HandlerInputFieldResult => {
  if (country === 'USA') {
    const regex = /^\d{5}(-\d{4})?$/;

    if (!regex.test(value)) {
      return { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA };
    }

    return { result: true };
  } else if (country === 'Canada') {
    const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

    if (!regex.test(value)) {
      return { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_Canada };
    }

    return { result: true };
  }

  return { result: false, errorMessage: PostalCodeErrorTooltips.Select_country };
};

export const handlerCountryField = (postalCode: string, value: string): HandlerInputFieldResult => {
  if (value === 'USA') {
    const regex = /^\d{5}(-\d{4})?$/;

    if (!regex.test(postalCode)) {
      return { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA };
    }

    return { result: true };
  } else if (value === 'Canada') {
    const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

    if (!regex.test(postalCode)) {
      return { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_Canada };
    }

    return { result: true };
  }

  return { result: false, errorMessage: PostalCodeErrorTooltips.Select_country };
};
