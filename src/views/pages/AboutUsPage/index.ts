import { AboutView } from './about-view';

export class AboutPage {
  private readonly view: AboutView;

  constructor() {
    this.view = new AboutView();
  }

  public render(): HTMLElement {
    const render = this.view.render();
    return render;
  }
}
