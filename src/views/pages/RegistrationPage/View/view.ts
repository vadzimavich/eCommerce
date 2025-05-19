import { elementCreator } from '../../../../utils/dom-helpers';
import * as content from './constant-content';
import * as inputsFieldContent from '../../../components/InputField/constants-content';
import * as formInputs from '../../../../utils/form-inputs';
import { RegistrationModel } from '../model';

export class RegistrationView {
  public form: HTMLFormElement;
  public linkNavigate: HTMLAnchorElement;
  private container: HTMLElement;
  private readonly submitButton: HTMLButtonElement;
  private readonly buttonViewPassword: HTMLButtonElement;
  private readonly inputPassword: HTMLInputElement;
  private readonly checkboxBillToShipping: HTMLElement;
  private readonly inputBillCountry: HTMLSelectElement;
  private readonly inputBillCity: HTMLInputElement;
  private readonly inputBillStreet: HTMLInputElement;
  private readonly inputBillPostCode: HTMLInputElement;
  constructor(private readonly model: RegistrationModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['reg'] });
    this.form = elementCreator(document.createElement('form'), { classNames: ['form'] });
    this.linkNavigate = elementCreator(document.createElement('a'), {
      classNames: ['navigate__link'],
      attributes: { 'data-route': '/sign-in' },
      content: content.RegistrationContent.Link_Sign_In,
    });
    this.submitButton = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'button'],
      attributes: { type: 'submit', disabled: '' },
      content: content.RegistrationContent.Button_form,
    });
    this.buttonViewPassword = elementCreator(document.createElement('button'), {
      classNames: ['password__button-view'],
      attributes: {
        type: 'button',
        id: 'password-view',
      },
    });
    this.inputPassword = formInputs.createInputPassword('password');
    this.checkboxBillToShipping = this.createCheckbox('shipping', content.CheckboxSetting.Bill_Shipping_Address);
    this.checkboxBillToShipping.classList.add('disabled');

    this.inputBillCountry = formInputs.createSelectCountry('billing-country', inputsFieldContent.countries);
    this.inputBillCity = formInputs.createInputCity('billing-city');
    this.inputBillStreet = formInputs.createInputStreet('billing-street');
    this.inputBillPostCode = formInputs.createInputPostalCode('billing-postal-code');
  }

  public render(): HTMLElement {
    this.createForm();

    this.container.append(this.form);

    return this.container;
  }

  public changeButtonSubmit(): void {
    if (this.model.checkValues()) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }

  public updateViewPassword(): void {
    const isView = this.inputPassword.getAttribute('type') === 'text';

    if (isView) {
      this.inputPassword.setAttribute('type', 'password');
      this.buttonViewPassword.classList.remove('view');
    } else {
      this.inputPassword.setAttribute('type', 'text');
      this.buttonViewPassword.classList.add('view');
    }
  }

  public updateViewChekboxShippingToBill(): void {
    const isCompleteShippingForm = this.model.checkShippingFieldsValidation();

    if (isCompleteShippingForm) {
      this.checkboxBillToShipping.classList.remove('disabled');
    } else {
      this.checkboxBillToShipping.classList.add('disabled');
    }
  }

  public updateBillingFields(): void {
    const formData = this.model.getDataForm();

    this.inputBillStreet.value = formData['billing-street'];
    this.inputBillCountry.value = formData['billing-country'];
    this.inputBillCity.value = formData['billing-city'];
    this.inputBillPostCode.value = formData['billing-postal-code'];
  }

  public getButtonViewPassword(): HTMLButtonElement {
    return this.buttonViewPassword;
  }

  public getCheckboxBillToShipping(): HTMLElement {
    return this.checkboxBillToShipping;
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
    this.form.append(this.submitButton);
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
    inputsWrapper.append(
      this.createInputWrapper(inputsFieldContent.AccountDataLabel.Email, formInputs.createInputEmail('email')),
      this.createInputWrapper(inputsFieldContent.AccountDataLabel.Password, this.inputPassword, this.buttonViewPassword)
    );
  }

  private createPersonalInfo(): void {
    const inputsWrapper = this.createInputsWrapper(content.RegistrationFormSection.Personal_Info);

    inputsWrapper.append(
      this.createInputWrapper(
        inputsFieldContent.PersonalInfoLabel.First_Name,
        formInputs.createInputFirstName('first-name')
      ),
      this.createInputWrapper(
        inputsFieldContent.PersonalInfoLabel.Last_Name,
        formInputs.createInputLastName('last-name')
      ),
      this.createInputWrapper(inputsFieldContent.PersonalInfoLabel.Birthday, formInputs.createInputBirthday('bday'))
    );
  }

  private createShippingAddress(): void {
    const checkboxesWrapper = elementCreator(document.createElement('div'), { classNames: ['form__checkboxes'] });
    const checkboxBillShipping = this.createCheckbox('bill', content.CheckboxSetting.Shipping_Address);

    checkboxesWrapper.append(this.checkboxBillToShipping, checkboxBillShipping);

    const inputsWrapper = this.createInputsWrapper(content.RegistrationFormSection.Shipping_Address, checkboxesWrapper);

    inputsWrapper.append(
      this.createInputWrapper(inputsFieldContent.AddressLabel.Street, formInputs.createInputStreet('shipping-street')),
      this.createInputWrapper(inputsFieldContent.AddressLabel.City, formInputs.createInputCity('shipping-city')),
      this.createInputWrapper(
        inputsFieldContent.AddressLabel.Country,
        formInputs.createSelectCountry('shipping-country', inputsFieldContent.countries)
      ),
      this.createInputWrapper(
        inputsFieldContent.AddressLabel.Postal_Code,
        formInputs.createInputPostalCode('shipping-postal-code')
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
    inputsWrapper.append(this.inputBillStreet, this.inputBillCountry, this.inputBillCity, this.inputBillPostCode);
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
