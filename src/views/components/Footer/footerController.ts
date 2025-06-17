import { AppModel } from '../../../models/state/AppState';
import { FooterView } from './footerView';

export class FooterController {
  constructor(
    private readonly appModel: AppModel,
    private readonly view: FooterView
  ) {}
}
