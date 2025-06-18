import { ButtonDesc } from './content';

export class MemberController {
  constructor(
    private readonly button: HTMLButtonElement,
    private readonly description: HTMLParagraphElement
  ) {
    this.handlerReadMore();
  }

  private handlerReadMore(): void {
    this.button.addEventListener('click', () => {
      this.button.textContent = this.button.textContent === ButtonDesc.Read ? ButtonDesc.Hide : ButtonDesc.Read;
      this.description.classList.toggle('read');
    });
  }
}
