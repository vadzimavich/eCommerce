import { handlerDateField } from '../../../utils/handler-fields';
import { DateErrorTooltips } from '../../../views/components/InputField/constants-content';

const today = new Date();
const day = today.getDate();
const month = today.getMonth();

const getTwoDigit = (value: number): string => {
  return value > 9 ? value.toString() : '0' + value;
};

const formateToday = `${today.getFullYear()}-${getTwoDigit(month + 1)}-${day}`;
const formateTomorrow = `${today.getFullYear()}-${getTwoDigit(month + 1)}-${getTwoDigit(day + 1)}`;

const testCases = [
  {
    values: ['1899-01-01'],
    expectedResult: { result: false, errorMessage: DateErrorTooltips.Date_before },
  },
  {
    values: ['9999-01-01', formateTomorrow],
    expectedResult: { result: false, errorMessage: DateErrorTooltips.Date_future },
  },
  {
    values: [formateToday],
    expectedResult: { result: false, errorMessage: DateErrorTooltips.Date_old },
  },
  {
    values: ['1900-01-01', '2000-01-01'],
    expectedResult: { result: true },
  },
];

describe('handlerNameField', () => {
  testCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${value}"`, () => {
        const result = handlerDateField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
