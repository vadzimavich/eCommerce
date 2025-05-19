import { handlerNameField } from '../utils/handler-fields';
import { NameErrorTooltips } from '../views/components/InputField/constants-content';

const testCases = [
  {
    values: [''],
    expectedResult: { result: false, errorMessage: NameErrorTooltips.Name_length },
  },
  {
    values: ['1', ' 1Alex', 'Alex ', '     '],
    expectedResult: { result: false, errorMessage: NameErrorTooltips.Name_value },
  },
  {
    values: ['A', 'Alex'],
    expectedResult: { result: true },
  },
];

describe('handlerNameField', () => {
  testCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${value}"`, () => {
        const result = handlerNameField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
