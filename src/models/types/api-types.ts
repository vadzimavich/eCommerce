import { Attribute } from '@commercetools/platform-sdk';

export type CustomerAddress = {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
  firstName?: string;
};

export type CustomerRegistrationData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  shippingAddress: CustomerAddress;
  billingAddress?: CustomerAddress;
  isShippingDefault: boolean;
  isBillingDefault: boolean;
  billToShippingAddress: boolean;
};

export type CustomerDraftBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: CustomerAddress[];
  shippingAddressIds: number[];
  billingAddressesIds: number[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};

export type CustomerLoginData = {
  email: string;
  password: string;
};

export type CTErrorBody = {
  statusCode?: number;
  message: string;
  errors?: {
    code: string;
    message: string;
  }[];
};

export type CTSDKError = {
  message: string;
  code?: number | string;
  statusCode?: number;
  body?: unknown;
};

// typeguard for SDK error
export function isCtErrorWithBodyMessage(
  error: unknown
): error is CTSDKError & { body: { message: string; errors?: { message: string }[] } } {
  if (typeof error === 'object' && error !== null && 'body' in error) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const errorWithBody = error as { body: unknown };
    if (
      typeof errorWithBody.body === 'object' &&
      errorWithBody.body !== null &&
      'message' in errorWithBody.body &&
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      typeof (errorWithBody.body as { message: unknown }).message === 'string'
    ) {
      if ('errors' in errorWithBody.body) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const bodyWithErrors = errorWithBody.body as { errors: unknown };
        if (Array.isArray(bodyWithErrors.errors)) {
          if (bodyWithErrors.errors.length > 0) {
            const firstError = bodyWithErrors.errors[0];
            if (
              typeof firstError !== 'object' ||
              firstError === null ||
              !('message' in firstError) ||
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              typeof (firstError as { message: unknown }).message !== 'string'
            ) {
              return false;
            }
          }
        } else if (bodyWithErrors.errors !== undefined) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

// typeguard for standart error
export function isStandardError(error: unknown): error is Error {
  return error instanceof Error;
}

export type ErrorResponse = {
  body?: CTErrorBody;
  message?: string;
  statusCode?: number;
};

export type ProductData = {
  id: string;
  title: string;
  description: string;
  price?: number;
  discountPrice?: number;
  currency?: string;
  image?: string;
  images?: string[];
  ecoScale?: string;
  sku?: string;
  slug?: string;
  attributes?: Attribute[];
};

export type ProductFilter = {
  [id: string]: string | boolean | number;
};

export type ProductQueryParameters = {
  sort?: string;
  limit?: number;
  page?: number;
  total?: number;
  searchText?: string;
  filters?: ProductFilter;
};

export type CategoryData = {
  id: string;
  name: string;
};
