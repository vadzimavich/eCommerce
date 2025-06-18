export type InfoItem = {
  src: string;
  label: string;
  href?: string;
  desc?: string;
};

export type InfoBlockParameters = {
  title: string;
  items: InfoItem[];
  baseClass: string;
};
