import { handlerPostalCodeField } from '../../../utils/handler-fields';
import { PostalCodeErrorTooltips } from '../../../views/components/InputField/constants-content';

const testCases = [
  {
    country: 'USA',
    values: ['1234', '242143', '', ' ', 'A1B 2C3'],
    expectedResult: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_USA },
  },
  {
    country: 'Canada',
    values: ['12345', 'A1B2C3'],
    expectedResult: { result: false, errorMessage: PostalCodeErrorTooltips.Postal_code_Canada },
  },
  {
    country: '',
    values: ['12345', 'A1B2C3'],
    expectedResult: { result: false, errorMessage: PostalCodeErrorTooltips.Select_country },
  },
  {
    country: 'USA',
    values: ['12345'],
    expectedResult: { result: true },
  },
  {
    country: 'Canada',
    values: ['A1B 2C3'],
    expectedResult: { result: true },
  },
];

describe('handlerNameField', () => {
  testCases.forEach(({ country, values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${country}":"${value}"`, () => {
        const result = handlerPostalCodeField(country, value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
