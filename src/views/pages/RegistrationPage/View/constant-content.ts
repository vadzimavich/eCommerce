export const countries = ['USA', 'Canada'];

export const enum RegistrationContent {
  Title = 'Create an account',
  Description = `Let's set you up to access your personal account.`,
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

export const enum EmailErrorTooltips {
  Email_symbol = `Email address must contain an '@' symbol separating local part and domain name.`,
  Email_domain = `Email address must contain a domain name (e.g., example.com).`,
  Email_whitespace = `Email address must not contain leading or trailing whitespace.`,
  Email_format = `Email address must be properly formatted (e.g., user@example.com).`,
}
