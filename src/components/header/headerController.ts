import { HeaderModel } from './headerModel';

export class HeaderController {
  constructor(private model: HeaderModel) {}

  public navigate(route: string): void {
    this.model.setRoute(route);
  }
}
