type Attributes = { [key: string]: string };
export type CustomHTMLElement = HTMLElement | HTMLAnchorElement | HTMLInputElement | HTMLButtonElement;
export type ElementParameters = {
  tag?: string;
  classNames?: string[];
  attributes?: Attributes;
  content?: string;
};
