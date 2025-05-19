import { LoginPageModel } from './model';
import { LoginPageView } from './view';

export class LoginPageController {
  constructor(
    private readonly model: LoginPageModel,
    private readonly view: LoginPageView
  ) {}
}
