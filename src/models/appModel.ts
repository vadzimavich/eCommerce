export class AppModel {
  public setRoute(route: string): void {
    location.hash = route;
  }
}
