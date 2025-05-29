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
  message?: string;
  errors?: {
    code: string;
    message: string;
  }[];
};

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
  image?: string;
  ecoScale?: string;
  sku?: string;
  slug?: string;
};

export type ProductQueryParameters = {
  sort?: string;
  limit?: number;
};
