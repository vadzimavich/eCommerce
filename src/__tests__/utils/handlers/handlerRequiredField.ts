import { handlerRequiredField } from '../../../utils/handler-fields';
import { NameErrorTooltips } from '../../../views/components/InputField/constants-content';

const testCases = [
  {
    values: ['', '    '],
    expectedResult: { result: false, errorMessage: NameErrorTooltips.Name_length },
  },
  {
    values: ['a', '1', '!'],
    expectedResult: { result: true },
  },
];

describe('handlerNameField', () => {
  testCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${value}"`, () => {
        const result = handlerRequiredField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
