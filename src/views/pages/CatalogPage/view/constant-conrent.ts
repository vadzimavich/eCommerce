export const enum FiltersContent {
  Title = 'FILTERS',
  Button_Clear = 'Clear Filters',
  Summary_Categoty = 'Category',
  Summary_Actions = 'Promo-Actions',
  Sumamary_Price = 'Price Range',
  Summary_Eco = 'Ecology',
  Category_Default_Option = 'Select Category',
  Ecology_Default_option = 'Select Eco-Class',
  Category_Error = 'No data',
}

export const enum SortHeaderContent {
  Placeholder_Search = 'Search for...',
}

export const ECO_CLASSES = [
  { key: 'A', label: 'high' },
  { key: 'B', label: 'medium' },
  { key: 'C', label: 'low' },
];

export const Promo_Actions = [
  { key: 'discount-price', label: 'Discount' },
  { key: 'bestsaller', label: 'Bestsaller' },
];

export const Price_Range = [
  { id: 'priceMin', placeholder: 'from' },
  { id: 'priceMax', placeholder: 'to' },
];

export const sortOptions = ['Name from A to Z', 'Name from Z to A', 'Price from low to high', 'Price from high to low'];
export const sortValues = ['name-asc', 'name-desc', 'price-asc', 'price-desc'];
