type CustomerAddress = {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
};

export type CustomerRegistrationData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: CustomerAddress;
};

export type CustomerLoginData = {
  username: string;
  password: string;
};
