export class HeaderModel {
  public setRoute(route: string): void {
    location.hash = route;
  }
}
