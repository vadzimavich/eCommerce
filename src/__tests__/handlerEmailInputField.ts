import { handlerEmailField } from '../utils/handler-fields';
import { EmailErrorTooltips } from '../views/components/InputField/constants-content';

const testCases = [
  {
    values: [' test@example.com ', ' test@example.com', 'test@example.com ', 'te st@example.com'],
    expectedResult: { result: false, errorMessage: EmailErrorTooltips.Email_whitespace },
  },
  {
    values: ['testexample.com'],
    expectedResult: { result: false, errorMessage: EmailErrorTooltips.Email_symbol },
  },
  {
    values: ['test@', 'test@example'],
    expectedResult: { result: false, errorMessage: EmailErrorTooltips.Email_domain },
  },
  {
    values: ['@example.com'],
    expectedResult: { result: false, errorMessage: EmailErrorTooltips.Email_format },
  },
  {
    values: ['test@example.com'],
    expectedResult: { result: true },
  },
];

describe('handlerEmailField', () => {
  testCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: ${value}`, () => {
        const result = handlerEmailField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
