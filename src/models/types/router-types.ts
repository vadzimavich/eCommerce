import { AppModel } from '../appModel';

type Main = {
  render: () => HTMLElement;
};

export type Routes = Record<string, new (appModel: AppModel) => Main>;
