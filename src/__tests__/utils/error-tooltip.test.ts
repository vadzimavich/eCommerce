/**
 * @jest-environment jsdom
 */

import { updateTooltip } from '../../utils/error-tooltip';

describe('Error tooltip', () => {
  const wrapper = document.createElement('div');
  const input = document.createElement('input');
  wrapper.classList.add('form__input__wrapper');
  wrapper.append(input);

  test('updateTooltip(): should add tooltip', () => {
    const result = { result: false, errorMessage: 'test' };
    updateTooltip(input, result);

    expect(wrapper.querySelector('.error-tooltip')).toBeTruthy();
    expect(wrapper.querySelector('.error-tooltip__message')?.textContent).toBe('test');
  });

  test('updateTooltip(): should change message of tooltip', () => {
    const result = { result: false, errorMessage: 'test2' };
    updateTooltip(input, result);

    expect(wrapper.querySelector('.error-tooltip')).toBeTruthy();
    expect(wrapper.querySelector('.error-tooltip__message')?.textContent).toBe('test2');
  });

  test('updateTooltip(): should remove tooltip', () => {
    const result = { result: false, errorMessage: 'test' };
    updateTooltip(input, result);
    expect(wrapper.querySelector('.error-tooltip')).toBeTruthy();

    const resultRemove = { result: true, errorMessage: 'test' };
    updateTooltip(input, resultRemove);
    expect(wrapper.querySelector('.error-tooltip')).not.toBeTruthy();
  });
});
