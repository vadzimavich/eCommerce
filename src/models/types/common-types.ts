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

export type MemberData = {
  name: string;
  description: string;
  image: string;
  contribution: string[];
  gitHub: string;
  roles: string[];
};
