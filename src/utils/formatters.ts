import { TypedMoney } from '@commercetools/platform-sdk';

export const getCurrentDateInStringFormat = (): string => {
  const now = new Date();

  const year = now.getFullYear();

  let month = (now.getMonth() + 1).toString();
  if (+month < 10) {
    month = '0' + month;
  }

  let day = now.getDate().toString();
  if (+day < 10) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
};

export const formatDateOfBirth = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'Not specified';
  }
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

export const formatPrice = (price: TypedMoney): string => {
  const { currencyCode, fractionDigits } = price;
  let amount = 0;

  if (price.type === 'centPrecision') {
    amount = price.centAmount / 10 ** fractionDigits;
  } else {
    amount = price.preciseAmount / 10 ** fractionDigits;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
};
