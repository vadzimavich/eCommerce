import { AppModel } from '../../../../models/state/AppState';
import { ProfilePageModel } from '../profilePageModel';
import { elementCreator } from '../../../../utils/dom-helpers';
import * as formInputs from '../../../../utils/form-inputs';
import type { Customer } from '@commercetools/platform-sdk';

export class PersonalInformationView {
  public editButton!: HTMLButtonElement;
  public saveButton!: HTMLButtonElement;
  public cancelButton!: HTMLButtonElement;

  public firstNameInput!: HTMLInputElement;
  public lastNameInput!: HTMLInputElement;
  public emailInput!: HTMLInputElement;
  public dateOfBirthInput!: HTMLInputElement;

  private sectionElement: HTMLElement;
  private fieldsContainer!: HTMLElement;
  private actionsBar!: HTMLElement;

  constructor(
    private readonly model: ProfilePageModel,
    private readonly appModel: AppModel
  ) {
    this.sectionElement = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__section'],
      attributes: { id: 'personal-info-section' },
    });
    this.createStructure();
    this.model.subscribePersonalInfoEdit(() => this.toggleEditModeUI());
  }

  public render(): HTMLElement {
    this.populateInitialValues();
    this.toggleEditModeUI();
    return this.sectionElement;
  }

  public getFirstNameInput(): HTMLInputElement {
    return this.firstNameInput;
  }

  public getLastNameInput(): HTMLInputElement {
    return this.lastNameInput;
  }

  public getEmailInput(): HTMLInputElement {
    return this.emailInput;
  }

  public getDateOfBirthInput(): HTMLInputElement {
    return this.dateOfBirthInput;
  }

  public getFormValues(): { firstName: string; lastName: string; email: string; dateOfBirth: string } | null {
    if (!this.model.getIsEditingPersonalInfo()) return null;
    return {
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      email: this.emailInput.value,
      dateOfBirth: this.dateOfBirthInput.value,
    };
  }

  public getSectionElement(): HTMLElement {
    return this.sectionElement;
  }

  public isFormValid(): boolean {
    if (!this.model.getIsEditingPersonalInfo()) return false;
    const inputs = [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput];
    if (inputs.some((input) => !input)) {
      return false;
    }
    return inputs.every((input) => input.dataset.correct === 'true');
  }

  private createStructure(): void {
    const title = elementCreator(document.createElement('h2'), {
      classNames: ['profile-page__section-title'],
      content: 'Personal Information',
    });
    this.fieldsContainer = this.createFields();
    this.actionsBar = this.createActionButtons();
    this.sectionElement.append(title, this.fieldsContainer, this.actionsBar);
  }

  private createFields(): HTMLElement {
    const currentUser = this.appModel.getCurrentUser();
    const container = elementCreator(document.createElement('div'), {
      classNames: ['profile-page__fields-container'],
    });

    this.firstNameInput = formInputs.createInputFirstName('profile-firstName');
    container.append(this.createInputWrapper('First Name:', this.firstNameInput));

    this.lastNameInput = formInputs.createInputLastName('profile-lastName');
    container.append(this.createInputWrapper('Last Name:', this.lastNameInput));

    this.emailInput = formInputs.createInputEmail('profile-email');
    container.append(this.createInputWrapper('Email:', this.emailInput));

    this.dateOfBirthInput = formInputs.createInputBirthday('profile-dateOfBirth');
    container.append(this.createInputWrapper('Date of Birth:', this.dateOfBirthInput));

    this.populateInitialValues(currentUser);
    return container;
  }

  private populateInitialValues(user: Partial<Customer> = this.appModel.getCurrentUser()): void {
    if (this.firstNameInput) this.firstNameInput.value = user.firstName || '';
    if (this.lastNameInput) this.lastNameInput.value = user.lastName || '';
    if (this.emailInput) this.emailInput.value = user.email || '';
    if (this.dateOfBirthInput) this.dateOfBirthInput.value = user.dateOfBirth || '';
  }

  private createActionButtons(): HTMLElement {
    const bar = elementCreator(document.createElement('div'), { classNames: ['profile-page__actions-bar'] });
    this.editButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button'],
      content: 'Edit Personal Info',
      attributes: { id: 'edit-personal-info-btn' },
    });
    this.saveButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--save'],
      content: 'Save Changes',
      attributes: { id: 'save-personal-info-btn' },
    });
    this.cancelButton = elementCreator(document.createElement('button'), {
      classNames: ['profile-page__button', 'button', 'button--cancel'],
      content: 'Cancel',
      attributes: { id: 'cancel-personal-info-btn' },
    });
    bar.append(this.editButton, this.saveButton, this.cancelButton);
    return bar;
  }

  private toggleEditModeUI(): void {
    const isEditing = this.model.getIsEditingPersonalInfo();
    const inputs = [this.firstNameInput, this.lastNameInput, this.emailInput, this.dateOfBirthInput];

    inputs.forEach((input) => {
      if (input) {
        input.readOnly = !isEditing;
        input.classList.toggle('form__input--readonly', !isEditing);
        input.classList.toggle('form__input--editable', isEditing);

        if (!isEditing) {
          this.populateInitialValues();
          input.setAttribute('data-correct', 'false');
          const wrapper = input.closest('.form__input__wrapper');
          wrapper?.querySelector('.error-tooltip')?.remove();
        }
        if (isEditing) input.dispatchEvent(new Event('input'));
      }
    });

    if (this.editButton) this.editButton.classList.toggle('hidden', isEditing);
    if (this.saveButton) {
      this.saveButton.classList.toggle('hidden', !isEditing);
      this.saveButton.disabled = isEditing ? !this.isFormValid() : true;
    }
    if (this.cancelButton) this.cancelButton.classList.toggle('hidden', !isEditing);
  }

  private createInputWrapper(labelContent: string, inputElement: HTMLInputElement): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['form__input__wrapper', 'profile-page__input-wrapper'],
    });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: inputElement.id },
      content: labelContent,
    });
    const requiredSpan = elementCreator(document.createElement('span'), {
      classNames: ['input_required'],
      content: '*',
    });
    label.append(requiredSpan);
    wrapper.append(label, inputElement);
    return wrapper;
  }
}
