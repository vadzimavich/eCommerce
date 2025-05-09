export const countries = ['USA', 'Canada'];

export const enum RegistrationContent {
  Title = 'Create an account',
  Description = 'Some text',
  Button_form = 'Create',
  Link_Description = 'Already have an account?',
  Link_Sign_In = 'Sign In',
  isRequired = ' *',
}

export const enum RegistrationFormSection {
  Personal_Info = 'Personal Info',
  Shipping_Address = 'Shipping Address',
  Billing_Address = 'Billing Address',
}

export const enum AccountDataLabel {
  Email = 'E-mail',
  Password = 'Password',
}

export const enum PersonalInfoLabel {
  First_Name = 'First Name',
  Last_Name = 'Last Name',
  Birthday = 'Date of Birth',
}

export const enum AddressLabel {
  Street = 'Street',
  City = 'City',
  Country = 'Country',
  Postal_Code = 'Postal Code',
}

export const enum CheckboxSetting {
  Shipping_Address = 'Set Shipping Address as default',
  Billing_Address = 'Set Billing Address as default',
  Bill_Shipping_Address = 'Bill to Shipping Address',
}
