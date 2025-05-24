import { handlerPasswordField } from '../utils/handler-fields';
import { PasswordErrorTooltips } from '../views/components/InputField/constants-content';

const passwordTestCases = [
  {
    values: [' Password1! ', ' Password1!', 'Password1! '],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_whitespace },
  },
  {
    values: ['', '1234567'],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_length },
  },
  {
    values: ['password', 'Password!'],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_number },
  },
  {
    values: ['12345678!', 'PASSWORD1!'],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_lower_letter },
  },
  {
    values: ['password1!'],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_upper_letter },
  },
  {
    values: ['Password1'],
    expectedResult: { result: false, errorMessage: PasswordErrorTooltips.Password_symbol },
  },
  {
    values: ['Password1!'],
    expectedResult: { result: true },
  },
];

describe('handlerPasswordField', () => {
  passwordTestCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${value}"`, () => {
        const result = handlerPasswordField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
