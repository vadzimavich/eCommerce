import { AppModel } from '../../../models/state/AppState';
import { AboutModel } from './about-model';
import { AboutView } from './about-view';

export class AboutController {
  constructor(
    private readonly appModel: AppModel,
    private readonly model: AboutModel,
    private readonly view: AboutView
  ) {}
}
