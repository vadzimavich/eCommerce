export type Button = {
  id?: string;
  text: string;
  classes: string[];
  disabled?: boolean;
  attributes?: Record<string, string>;
};

export type DivElementOptions = {
  tag?: 'div';
  id?: string;
  text?: string;
  children?: HTMLElement[];
  classes?: string[];
  attributes?: Record<string, string>;
};
