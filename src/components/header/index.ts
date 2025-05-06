import { HeaderController } from './headerController';
import { HeaderModel } from './headerModel';
import { HeaderView } from './headerView';

export class Header {
  public init(): HTMLElement {
    const model = new HeaderModel();
    const controller = new HeaderController(model);
    const view = new HeaderView(controller);
    return view.render();
  }
}
