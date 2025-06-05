import { handlerPostalCodeField } from '../../../utils/handler-fields';
import { PostalCodeErrorTooltips } from '../../../views/components/InputField/constants-content';

const testCases = [
  {
    countryCode: 'US',
    valuesAndExpected: [
      { value: '1234', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA } },
      { value: '242143', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA } },
      { value: '', expected: { result: false, errorMessage: 'Please enter a postal code.' } },
      { value: ' ', expected: { result: false, errorMessage: 'Please enter a postal code.' } },
      { value: 'A1B 2C3', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA } },
      { value: '12345', expected: { result: true } },
      { value: '90210-1234', expected: { result: true } },
    ],
  },

  {
    countryCode: 'CA',
    valuesAndExpected: [
      { value: '12345', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_Canada } },
      { value: 'A1B2C3', expected: { result: true } },
      { value: 'A1B 2C3', expected: { result: true } },
      { value: 'a1b 2c3', expected: { result: true } },
      { value: 'A1B-2C3', expected: { result: true } },
      { value: 'A1 2C3', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_Canada } },
    ],
  },

  {
    countryCode: '',
    valuesAndExpected: [
      { value: '12345', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Select_country } },
      { value: 'A1B 2C3', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Select_country } },
      { value: '', expected: { result: false, errorMessage: PostalCodeErrorTooltips.Select_country } },
    ],
  },

  {
    countryCode: 'DE',
    valuesAndExpected: [
      { value: '12345', expected: { result: true } },
      { value: 'ABCDE', expected: { result: true } },
    ],
  },

  {
    countryCode: 'FR',
    valuesAndExpected: [
      { value: '', expected: { result: false, errorMessage: 'Please enter a postal code.' } },
      { value: '   ', expected: { result: false, errorMessage: 'Please enter a postal code.' } },
    ],
  },
];

describe('handlerPostalCodeField', () => {
  testCases.forEach(({ countryCode, valuesAndExpected }) => {
    valuesAndExpected.forEach(({ value, expected }) => {
      it(`Test value: "${countryCode}":"${value}"`, () => {
        const result = handlerPostalCodeField(countryCode, value);
        expect(result).toEqual(expected);
      });
    });
  });
});
