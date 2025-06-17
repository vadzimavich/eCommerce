import { elementCreator } from '../../../utils/dom-helpers';
import { AboutModel } from './about-model';
import * as content from './components/content';

export class AboutView {
  private readonly container: HTMLElement;
  constructor(private readonly model: AboutModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['page-wrapper', 'about'],
    });
  }

  public render(): HTMLElement {
    this.createTeamInfo();
    this.createPlatformInfo();
    return this.container;
  }

  private createTeamInfo(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['about__team'],
    });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['title'],
      content: content.Team.Title,
    });

    const description = elementCreator(document.createElement('p'), {
      classNames: ['desc'],
      content: content.Team.Description,
    });

    const titleMission = elementCreator(document.createElement('h3'), {
      classNames: ['title'],
      content: content.Team.Title_mission,
    });

    const descriptionMission = elementCreator(document.createElement('p'), {
      classNames: ['desc'],
      content: content.Team.Description_mission,
    });

    wrapper.append(title, description, titleMission, descriptionMission);
    this.container.append(wrapper);
  }

  private createPlatformInfo(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['about__platform'],
    });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['title'],
      content: content.Platform.Title,
    });

    const description = elementCreator(document.createElement('p'), {
      classNames: ['desc'],
      content: content.Platform.Description,
    });

    wrapper.append(title, description);
    this.container.append(wrapper);
  }
}
