import { AppModel } from '../state/AppState';

export type Main = {
  render: () => HTMLElement;
};

export type RouteParameters = Record<string, string>;

export type Routes = Record<string, new (appModel: AppModel, routeParameters?: RouteParameters) => Main>;
