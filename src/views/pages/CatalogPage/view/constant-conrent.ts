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

export const ECO_CLASSES = [
  { key: 'A', label: 'high' },
  { key: 'B', label: 'medium' },
  { key: 'C', label: 'low' },
];

export const Promo_Actions = [
  { key: 'discount-price', label: 'Discount' },
  { key: 'bestsaller', label: 'Bestsaller' },
];
