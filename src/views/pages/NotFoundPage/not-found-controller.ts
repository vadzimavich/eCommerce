import { route } from '../../../app';
import { NotFoundView } from './not-found-view';

export class NotFoundController {
  private readonly button: HTMLButtonElement;
  private readonly handleClick: () => void;

  constructor(private readonly view: NotFoundView) {
    this.button = this.view.getButtonToHome();
    this.handleClick = (): void => this.navigateToHome();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.button.addEventListener('click', this.handleClick);
  }

  private removeEventListeners(): void {
    this.button.removeEventListener('click', this.handleClick);
  }

  private navigateToHome(): void {
    this.removeEventListeners();
    route.navigate('/home');
  }
}
