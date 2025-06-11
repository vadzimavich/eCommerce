/**
 * @jest-environment jsdom
 */

import { Modal } from '../../components/modal';
import { ModalView } from '../../components/modal/modalView';

// eslint-disable-next-line max-lines-per-function
describe('Modal', () => {
  let modalView: ModalView;

  beforeEach(() => {
    modalView = new ModalView();
  });

  test('should be defined', () => {
    expect(modalView).toBeDefined();
  });

  test('Modal.getInstance(): should return the Modal', () => {
    const result = Modal.getInstance();
    expect(result).toBeInstanceOf(Modal);
  });

  test('renderError(): ', () => {
    let mockView = {
      modal: document.createElement('dialog'),
      button: document.createElement('button'),
      renderError: modalView.renderError,
      addMessage: jest.fn(),
    };

    mockView.modal.showModal = jest.fn();
    const result = mockView.renderError('test');

    expect(mockView.addMessage).toHaveBeenCalled();
    expect(mockView.modal.showModal).toHaveBeenCalled();
    expect(result).toBe(mockView.modal);
  });

  test('renderInfo(): ', () => {
    let mockView = {
      modal: document.createElement('dialog'),
      button: document.createElement('button'),
      renderInfo: modalView.renderInfo,
      remove: modalView.remove,
      addMessage: jest.fn(),
    };

    mockView.modal.showModal = jest.fn();
    mockView.renderInfo('test');
    const result = mockView.renderInfo('test');

    expect(mockView.addMessage).toHaveBeenCalled();
    expect(mockView.modal.showModal).toHaveBeenCalled();
    expect(result).toBe(mockView.modal);

    setTimeout(() => {
      expect(mockView.remove).toHaveBeenCalled();
    }, 3000);
  });
});
