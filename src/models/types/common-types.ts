export type RequiredField = {
  [id: string]: boolean;
};

export type DataForm = {
  [id: string]: string;
};

export type HandlerInputFieldResult = {
  result: boolean;
  errorMessage?: string;
};
