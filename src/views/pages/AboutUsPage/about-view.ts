import { elementCreator } from '../../../utils/dom-helpers';
import * as content from './components/content';
import { Member } from './components/member';

export class AboutView {
  private readonly container: HTMLElement;

  constructor() {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['page-wrapper', 'about'],
    });
  }

  public render(): HTMLElement {
    this.createTeamInfo();
    this.createMembers();
    this.createSectionPlatform();
    return this.container;
  }

  private createMembers(): void {
    const wrapper = elementCreator(document.createElement('ul'), {
      classNames: ['members'],
    });

    wrapper.append(new Member(content.Andrey).render());
    wrapper.append(new Member(content.Denis).render());
    wrapper.append(new Member(content.Tanya).render());
    this.container.append(wrapper);
  }

  private createTeamInfo(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['about__team', 'wrapper'],
    });

    const imgWrapper = elementCreator(document.createElement('div'), {
      classNames: ['img__wrapper'],
    });

    wrapper.append(this.createContentTeam(), imgWrapper);
    this.container.append(wrapper);
  }

  private createContentTeam(): HTMLElement {
    const contentWrapper = elementCreator(document.createElement('div'), {
      classNames: ['content'],
    });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['title', 'name'],
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

    for (let i = 0; i < 3; i++) {
      const background = elementCreator(document.createElement('div'), {
        classNames: ['background'],
      });

      contentWrapper.append(background);
    }

    contentWrapper.append(title, description, titleMission, descriptionMission);

    return contentWrapper;
  }

  private createPlatformInfo(): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['platform__content', 'wrapper'],
    });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['title'],
      content: content.Platform.Title,
    });

    const description = elementCreator(document.createElement('p'), {
      classNames: ['desc'],
      content: content.Platform.Description,
    });

    const link = elementCreator(document.createElement('a'), {
      classNames: ['link'],
      attributes: {
        href: content.Platform.Url,
        target: '_blank',
      },
    });

    wrapper.append(title, description, link);
    return wrapper;
  }

  private createSectionPlatform(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['about__platform'],
    });

    const imgWrapper = elementCreator(document.createElement('div'), {
      classNames: ['img__wrapper'],
    });

    wrapper.append(imgWrapper, this.createPlatformInfo());

    this.container.append(wrapper);
  }
}
