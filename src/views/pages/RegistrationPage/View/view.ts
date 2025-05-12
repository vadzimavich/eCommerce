import { elementCreator } from '../../../../utils/dom-helpers';
import * as content from './constant-content';
import * as formInputs from '../../../../utils/form-inputs';

export class RegistrationView {
  public form: HTMLFormElement;
  public linkNavigate: HTMLAnchorElement;
  private container: HTMLElement;

  constructor() {
    this.container = elementCreator(document.createElement('section'), { classNames: ['reg'] });
    this.form = elementCreator(document.createElement('form'), { classNames: ['form'] });
    this.linkNavigate = elementCreator(document.createElement('a'), {
      classNames: ['navigate__link'],
      attributes: { 'data-route': '/sign-in' },
      content: content.RegistrationContent.Link_Sign_In,
    });
  }

  public render(): HTMLElement {
    this.createForm();

    this.container.append(this.form);

    return this.container;
  }

  private createTitle(): void {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['reg__title__wrapper'],
    });

    const title = elementCreator(document.createElement('h1'), {
      classNames: ['reg__title'],
      content: content.RegistrationContent.Title,
    });

    const description = elementCreator(document.createElement('p'), {
      classNames: ['reg__description'],
      content: content.RegistrationContent.Description,
    });

    wrapper.append(title, description);
    this.form.append(wrapper);
  }

  private createForm(): HTMLElement {
    this.createTitle();
    this.createAccountData();
    this.createPersonalInfo();
    this.createShippingAddress();
    this.createBillingAddress();

    const button = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'button'],
      attributes: { type: 'submit', disabled: '' },
      content: content.RegistrationContent.Button_form,
    });

    this.form.append(button);

    this.createRoutingSingIn();

    return this.form;
  }

  private createInputsWrapper(titleContent?: string, checkboxes?: HTMLElement): HTMLElement {
    const wrapper = elementCreator(document.createElement('section'), {
      classNames: ['reg__subtitle__wrapper'],
    });

    const inputsWrapper = elementCreator(document.createElement('div'), {
      classNames: ['reg__inputs__wrapper'],
    });

    if (titleContent) {
      const title = elementCreator(document.createElement('h2'), {
        classNames: ['reg__subtitle'],
        content: titleContent,
      });

      wrapper.append(title);
    }

    wrapper.append(inputsWrapper);

    if (checkboxes) {
      wrapper.append(checkboxes);
    }

    this.form.append(wrapper);

    return inputsWrapper;
  }

  private createAccountData(): void {
    const inputsWrapper = this.createInputsWrapper();

    const buttonViewPassword = elementCreator(document.createElement('button'), {
      classNames: ['password__button-view'],
      attributes: {
        type: 'button',
        id: 'password-view',
      },
    });

    inputsWrapper.append(
      this.createInputWrapper(content.AccountDataLabel.Email, formInputs.createInputEmail('email')),
      this.createInputWrapper(
        content.AccountDataLabel.Password,
        formInputs.createInputPassword('password'),
        buttonViewPassword
      )
    );
  }

  private createPersonalInfo(): void {
    const inputsWrapper = this.createInputsWrapper(content.RegistrationFormSection.Personal_Info);

    inputsWrapper.append(
      this.createInputWrapper(content.PersonalInfoLabel.First_Name, formInputs.createInputFirstName('first-name')),
      this.createInputWrapper(content.PersonalInfoLabel.Last_Name, formInputs.createInputLastName('last-name')),
      this.createInputWrapper(content.PersonalInfoLabel.Birthday, formInputs.createInputBirthday('birthday'))
    );
  }

  private createShippingAddress(): void {
    const checkboxesWrapper = elementCreator(document.createElement('div'), { classNames: ['form__checkboxes'] });

    const checkboxIsDefault = this.createCheckbox('shipping', content.CheckboxSetting.Bill_Shipping_Address);
    const checkboxBillShipping = this.createCheckbox('bill', content.CheckboxSetting.Shipping_Address);

    checkboxesWrapper.append(checkboxIsDefault, checkboxBillShipping);

    const inputsWrapper = this.createInputsWrapper(content.RegistrationFormSection.Shipping_Address, checkboxesWrapper);

    inputsWrapper.append(
      this.createInputWrapper(content.AddressLabel.Street, formInputs.createInputStreet('shipping-street')),
      this.createInputWrapper(content.AddressLabel.City, formInputs.createInputCity('shipping-city')),
      this.createInputWrapper(
        content.AddressLabel.Country,
        formInputs.createSelectCountry('shipping-country', content.countries)
      ),
      this.createInputWrapper(
        content.AddressLabel.Postal_Code,
        formInputs.createInputPostalCode('shipping-portal-code')
      )
    );
  }

  private createCheckbox(idInput: string, contentText: string): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'));
    const checkbox = elementCreator(document.createElement('input'), { attributes: { type: 'checkbox', id: idInput } });
    const label = elementCreator(document.createElement('label'), {
      attributes: { for: idInput },
      content: contentText,
    });

    wrapper.append(checkbox, label);
    return wrapper;
  }

  private createBillingAddress(): void {
    const checkboxesWrapper = elementCreator(document.createElement('div'), { classNames: ['form__checkboxes'] });
    const checkboxIsDefault = this.createCheckbox('billing', content.CheckboxSetting.Billing_Address);

    checkboxesWrapper.append(checkboxIsDefault);

    const inputsWrapper = this.createInputsWrapper(content.RegistrationFormSection.Billing_Address, checkboxesWrapper);
    inputsWrapper.append(
      this.createInputWrapper(content.AddressLabel.Street, formInputs.createInputStreet('billing-street')),
      this.createInputWrapper(content.AddressLabel.City, formInputs.createInputCity('billing-city')),
      this.createInputWrapper(
        content.AddressLabel.Country,
        formInputs.createSelectCountry('billing-country', content.countries)
      ),
      this.createInputWrapper(content.AddressLabel.Postal_Code, formInputs.createInputPostalCode('billing-portal-code'))
    );
  }

  private createInputWrapper(
    labelContent: string,
    input: HTMLInputElement | HTMLSelectElement,
    button?: HTMLButtonElement
  ): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['reg__input__wrapper'],
    });

    const labelInput = elementCreator(document.createElement('label'), {
      attributes: { for: input.id },
      content: labelContent,
    });
    const required = elementCreator(document.createElement('span'), {
      classNames: ['input_required'],
      content: content.RegistrationContent.isRequired,
    });

    labelInput.append(required);

    if (button) {
      const passwordContainer = elementCreator(document.createElement('div'), {
        classNames: ['password__container'],
      });

      passwordContainer.append(input, button);
      wrapper.append(labelInput, passwordContainer);
    } else {
      wrapper.append(labelInput, input);
    }

    return wrapper;
  }

  private createRoutingSingIn(): void {
    const container = elementCreator(document.createElement('section'), {
      classNames: ['navigate'],
    });
    const description = elementCreator(document.createElement('p'), {
      content: content.RegistrationContent.Link_Description,
    });

    container.append(description, this.linkNavigate);
    this.form.append(container);
  }
}
