type CustomerAddress = {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
};

export type CustomerLoginData = {
  email: string;
  password: string;
};

export type CustomerRegistrationData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: CustomerAddress;
  dateOfBirth: string;
};
