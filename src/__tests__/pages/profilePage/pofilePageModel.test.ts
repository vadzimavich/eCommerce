/**
 * @jest-environment jsdom
 */

import { elementCreator } from '../../../utils/dom-helpers';
import { ProfilePageModel } from '../../../views/pages/ProfilePage/profilePageModel';

// eslint-disable-next-line max-lines-per-function
describe('ProfilePageModel:', () => {
  let profileModel = new ProfilePageModel();
  const mockModel = {
    changePasswordDataForm: {
      'profile-current-password': '',
      'profile-new-password': '',
      'profile-confirm-password': '',
    },
    changePasswordStatusForm: {
      'profile-current-password': false,
      'profile-new-password': false,
      'profile-confirm-password': false,
    },
    isEditingPersonalInfo: false,
    personalInfoEditListeners: [],
    isPasswordEditModeActive: false,
    passwordEditModeListeners: [],
    setIsPasswordEditModeActive: profileModel.setIsPasswordEditModeActive,
    getIsEditingPersonalInfo: profileModel.getIsEditingPersonalInfo,
    setIsEditingPersonalInfo: profileModel.setIsEditingPersonalInfo,
    subscribePersonalInfoEdit: profileModel.subscribePersonalInfoEdit,
    getIsPasswordEditModeActive: profileModel.getIsPasswordEditModeActive,
    subscribePasswordEditMode: profileModel.subscribePasswordEditMode,
    updateChangePasswordFieldState: profileModel.updateChangePasswordFieldState,
    isChangePasswordFormValid: profileModel.isChangePasswordFormValid,
    initChangePasswordFormState: jest.fn(),
    notifyPasswordEditModeListeners: jest.fn(),
  };

  beforeEach(() => {
    mockModel.setIsPasswordEditModeActive = profileModel.setIsPasswordEditModeActive;
    mockModel.getIsEditingPersonalInfo = profileModel.getIsEditingPersonalInfo;
    mockModel.setIsEditingPersonalInfo = profileModel.setIsEditingPersonalInfo;
    mockModel.subscribePersonalInfoEdit = profileModel.subscribePersonalInfoEdit;
    mockModel.getIsPasswordEditModeActive = profileModel.getIsPasswordEditModeActive;
    mockModel.subscribePasswordEditMode = profileModel.subscribePasswordEditMode;
    mockModel.updateChangePasswordFieldState = profileModel.updateChangePasswordFieldState;
    mockModel.isChangePasswordFormValid = profileModel.isChangePasswordFormValid;
  });

  describe('setIsPasswordEditModeActive():', () => {
    test('activates password edit mode and initializes form state', () => {
      mockModel.setIsPasswordEditModeActive(true);

      expect(mockModel.isPasswordEditModeActive).toEqual(true);
      expect(mockModel.initChangePasswordFormState).toHaveBeenCalled();
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('deactivates password edit mode and reinitializes form state', () => {
      mockModel.setIsPasswordEditModeActive(false);

      expect(mockModel.isPasswordEditModeActive).toEqual(false);
      expect(mockModel.initChangePasswordFormState).toHaveBeenCalled();
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });
  });

  describe('updateChangePasswordFieldState():', () => {
    const element = elementCreator(document.createElement('input'), {
      attributes: { value: 'test' },
    });

    test('updates profile-current-password status when input is non-empty', () => {
      element.id = 'profile-current-password';

      mockModel.updateChangePasswordFieldState.call(mockModel, element);

      expect(mockModel.changePasswordStatusForm['profile-current-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-new-password status with isPasswordValid=false', () => {
      element.id = 'profile-new-password';

      mockModel.updateChangePasswordFieldState.call(mockModel, element, false);

      expect(mockModel.changePasswordStatusForm['profile-new-password']).toBe(false);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-new-password status with isPasswordValid=true', () => {
      element.id = 'profile-new-password';

      mockModel.updateChangePasswordFieldState.call(mockModel, element, true);

      expect(mockModel.changePasswordStatusForm['profile-new-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-confirm-password status when new and confirm passwords match and new password is valid', () => {
      element.id = 'profile-confirm-password';

      mockModel.changePasswordDataForm['profile-new-password'] = 'test';
      mockModel.changePasswordDataForm['profile-confirm-password'] = 'test';
      mockModel.changePasswordStatusForm['profile-new-password'] = true;

      mockModel.updateChangePasswordFieldState.call(mockModel, element);

      expect(mockModel.changePasswordStatusForm['profile-confirm-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });
  });

  describe('subscribePersonalInfoEdit():', () => {
    test('adds a listener for personal info edits', () => {
      const listener = jest.fn();
      mockModel.subscribePersonalInfoEdit(listener);

      expect(mockModel.personalInfoEditListeners).toContain(listener);
    });
  });

  describe('updateChangePasswordFieldState():', () => {
    const element = document.createElement('input');

    test('updates profile-current-password status when input is non-empty', () => {
      element.id = 'profile-current-password';
      element.value = 'test';

      mockModel.updateChangePasswordFieldState(element);

      expect(mockModel.changePasswordStatusForm['profile-current-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-new-password status with isPasswordValid=false', () => {
      element.id = 'profile-new-password';
      element.value = 'test';

      mockModel.updateChangePasswordFieldState(element, false);

      expect(mockModel.changePasswordStatusForm['profile-new-password']).toBe(false);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-new-password status with isPasswordValid=true', () => {
      element.id = 'profile-new-password';
      element.value = 'test';

      mockModel.updateChangePasswordFieldState(element, true);

      expect(mockModel.changePasswordStatusForm['profile-new-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });

    test('updates profile-confirm-password status when new and confirm passwords match and new password is valid', () => {
      element.id = 'profile-confirm-password';
      mockModel.changePasswordDataForm['profile-new-password'] = 'test';
      mockModel.changePasswordDataForm['profile-confirm-password'] = 'test';
      mockModel.changePasswordStatusForm['profile-new-password'] = true;

      mockModel.updateChangePasswordFieldState(element);

      expect(mockModel.changePasswordStatusForm['profile-confirm-password']).toBe(true);
      expect(mockModel.notifyPasswordEditModeListeners).toHaveBeenCalled();
    });
  });

  describe('isChangePasswordFormValid():', () => {
    test('returns true when all fields are valid', () => {
      mockModel.changePasswordStatusForm['profile-current-password'] = true;
      mockModel.changePasswordStatusForm['profile-new-password'] = true;
      mockModel.changePasswordStatusForm['profile-confirm-password'] = true;

      expect(mockModel.isChangePasswordFormValid()).toBe(true);
    });

    test('returns false when any field is invalid', () => {
      mockModel.changePasswordStatusForm['profile-current-password'] = true;
      mockModel.changePasswordStatusForm['profile-new-password'] = false;
      mockModel.changePasswordStatusForm['profile-confirm-password'] = true;

      expect(mockModel.isChangePasswordFormValid()).toBe(false);
    });
  });

  describe('subscribePasswordEditMode():', () => {
    test('adds a listener for password edit mode changes', () => {
      const listener = jest.fn();
      mockModel.subscribePasswordEditMode(listener);

      expect(mockModel.passwordEditModeListeners).toContain(listener);
    });
  });
});
