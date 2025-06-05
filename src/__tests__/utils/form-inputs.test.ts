/**
 * @jest-environment jsdom
 */

import {
  createInputBirthday,
  createInputCity,
  createInputEmail,
  createInputFirstName,
  createInputLastName,
  createInputPassword,
  createInputPostalCode,
  createInputStreet,
  createSelectCountry,
} from '../../utils/form-inputs';

// eslint-disable-next-line max-lines-per-function
describe('parserFilters', () => {
  test('createInputEmail(): should return input', () => {
    const result = createInputEmail('email');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('email');
    expect(result.type).toBe('email');
  });

  test('createInputPassword(): should return input', () => {
    const result = createInputPassword('password');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('password');
    expect(result.type).toBe('password');
  });

  test('createInputFirstName(): should return input', () => {
    const result = createInputFirstName('name');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('name');
    expect(result.type).toBe('text');
  });

  test('createInputLastName(): should return input', () => {
    const result = createInputLastName('name');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('name');
    expect(result.type).toBe('text');
  });

  test('createInputBirthday(): should return input', () => {
    const result = createInputBirthday('bday');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('bday');
    expect(result.type).toBe('date');
  });

  test('createInputStreet(): should return input', () => {
    const result = createInputStreet('street');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('street');
    expect(result.type).toBe('text');
  });

  test('createInputCity(): should return input', () => {
    const result = createInputCity('test');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('test');
    expect(result.type).toBe('text');
  });

  test('createInputPostalCode(): should return input', () => {
    const result = createInputPostalCode('test');

    expect(result).toBeInstanceOf(HTMLInputElement);
    expect(result.id).toBe('test');
    expect(result.type).toBe('text');
  });

  test('createSelectCountry(): should return select with options', () => {
    const result = createSelectCountry('test', ['value1', 'value2']);

    expect(result).toBeInstanceOf(HTMLSelectElement);
    expect(result.querySelector('option')).toBeInstanceOf(HTMLOptionElement);
    expect(result.querySelector('option')?.value).toBe('value1');
    expect(result.querySelector('option')?.textContent).toBe('Value1');
  });
});
