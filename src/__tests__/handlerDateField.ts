import { handlerDateField } from '../utils/handler-fields';
import { DateErrorTooltips } from '../views/components/InputField/constants-content';

const today = new Date();
const day = today.getDate();
const month = today.getMonth();

const getTwoDigit = (value: number): string => {
  return value > 9 ? value.toString() : '0' + value;
};

const formateToday = `${today.getFullYear()}-${getTwoDigit(month + 1)}-${day}`;
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const formateTomorrow = `${tomorrow.getFullYear()}-${getTwoDigit(tomorrow.getMonth() + 1)}-${getTwoDigit(tomorrow.getDate())}`;

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

describe('handlerDataField', () => {
  testCases.forEach(({ values, expectedResult }) => {
    values.forEach((value) => {
      it(`Test value: "${value}"`, () => {
        const result = handlerDateField(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
