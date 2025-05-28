export const countries = ['USA', 'Canada'];

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

export const enum EmailErrorTooltips {
  Email_symbol = `Email address must contain an '@' symbol separating local part and domain name.`,
  Email_domain = `Email address must contain a domain name (e.g., example.com).`,
  Email_whitespace = `Email address must not contain leading or trailing whitespace.`,
  Email_format = `Email address must be properly formatted (e.g., user@example.com).`,
}

export const enum PasswordErrorTooltips {
  Password_length = `Password must be at least 8 characters long.`,
  Password_upper_letter = `Password must contain at least one uppercase letter (A-Z).`,
  Password_lower_letter = `Password must contain at least one lowercase letter (a-z).`,
  Password_number = `Password must contain at least one digit (0-9).`,
  Password_symbol = ` Password must contain at least one special character (e.g., !@#$%^&*-).`,
  Password_whitespace = `Password must not contain leading or trailing whitespace.`,
}

export const enum NameErrorTooltips {
  Name_value = `Must contain only letters (no special characters or numbers).`,
  Name_length = `Must contain at least one character.`,
}

export const enum DateErrorTooltips {
  Date_before = `The birthday cannot be before 1900.`,
  Date_future = `Birthday cannot be in the future.`,
  Date_old = `User must be at least 13 years old.`,
}

export const enum PostalCodeErrorTooltips {
  Postal_code_USA = `Postal code must follow the format for the USA (e.g., 12345).`,
  Postal_code_Canada = `Postal code must follow the format for Canada (e.g., A1B 2C3).`,
  Select_country = `Select a country.`,
}

export const sortOptions = ['Price from low to high', 'Price from high to low', 'Name from A to Z', 'Name from Z to A'];
export const sortValues = ['a', 'b', 'asc', 'desc'];
