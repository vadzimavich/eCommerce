/**
 * @jest-environment jsdom
 */

import { AppModel } from '../../../models/state/AppState';
import { elementCreator } from '../../../utils/dom-helpers';
import { ProfilePageModel } from '../../../views/pages/ProfilePage/profilePageModel';
import { PersonalInformationView } from '../../../views/pages/ProfilePage/view/PersonalInformationView';

jest.mock('../../../views/pages/ProfilePage/profilePageModel');

// eslint-disable-next-line max-lines-per-function
describe('PersonalInformationView', () => {
  let mockApp: AppModel;
  let mockModel: ProfilePageModel;
  let mockView: PersonalInformationView;

  beforeEach(() => {
    mockApp = new AppModel();
    mockModel = new ProfilePageModel();
    mockView = new PersonalInformationView(mockModel, mockApp);

    mockView.firstNameInput = elementCreator(document.createElement('input'), {
      attributes: { value: 'first', ['data-correct']: 'true' },
    });
    mockView.lastNameInput = elementCreator(document.createElement('input'), {
      attributes: { value: 'last', ['data-correct']: 'true' },
    });
    mockView.emailInput = elementCreator(document.createElement('input'), {
      attributes: { value: 'email', ['data-correct']: 'true' },
    });
    mockView.dateOfBirthInput = elementCreator(document.createElement('input'), {
      attributes: { value: 'date', ['data-correct']: 'true' },
    });
  });

  describe('getFormValues():', () => {
    test('should return null if not editing', () => {
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(false);
      const result = mockView.getFormValues();

      expect(result).toBe(null);
    });

    test('should return form values if editing', () => {
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(true);
      mockView.firstNameInput = elementCreator(document.createElement('input'), {
        attributes: { value: 'first' },
      });
      mockView.lastNameInput = elementCreator(document.createElement('input'), { attributes: { value: 'last' } });
      mockView.emailInput = elementCreator(document.createElement('input'), { attributes: { value: 'email' } });
      mockView.dateOfBirthInput = elementCreator(document.createElement('input'), {
        attributes: { value: 'date' },
      });

      const result = mockView.getFormValues();
      expect(result).toEqual({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        dateOfBirth: 'date',
      });
    });
  });

  describe('isFormValid():', () => {
    test('should return false', () => {
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(false);
      const result = mockView.isFormValid();

      expect(result).toBe(false);
    });

    test('should return true', () => {
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(true);

      const result = mockView.isFormValid();
      expect(result).toEqual(true);
    });

    test('should return false', () => {
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(true);
      mockView.dateOfBirthInput.dataset.correct = 'false';

      const result = mockView.isFormValid();
      expect(result).toEqual(false);
    });
  });

  describe('render():', () => {
    test('render() sets input values and toggles edit mode UI', () => {
      const user = {
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        dateOfBirth: 'date',
      };

      mockApp.getCurrentUser = jest.fn().mockReturnValue(user);
      mockModel.getIsEditingPersonalInfo = jest.fn().mockReturnValue(true);

      const section = mockView.render();

      expect(mockView.firstNameInput.value).toBe('first');
      expect(mockView.lastNameInput.value).toBe('last');
      expect(mockView.emailInput.value).toBe('email');
      expect(mockView.dateOfBirthInput.value).toBe('date');

      expect(mockView.firstNameInput.readOnly).toBe(false);
      expect(mockView.lastNameInput.readOnly).toBe(false);
      expect(mockView.emailInput.readOnly).toBe(false);
      expect(mockView.dateOfBirthInput.readOnly).toBe(false);

      expect(section).toBeInstanceOf(HTMLElement);
    });
  });
});
