import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from './signup';
import { Alert } from 'react-native';

// 🔧 MOCK Firebase
jest.mock('../Firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and buttons', () => {
    const { getByText } = render(<SignUpScreen />);
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
  });

  it('shows alert if required fields are missing', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Sign up'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter all fields');
  });

  it('shows alert if passwords do not match', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText, getByPlaceholderText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'abcd@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'abcdef');
    fireEvent.press(getByText('Sign up'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
  });

  it('registers successfully with abcd@gmail.com', async () => {
    const { createUserWithEmailAndPassword } = require('firebase/auth');
    const { setDoc } = require('firebase/firestore');
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { email: 'abcd@gmail.com' },
    });
    setDoc.mockResolvedValueOnce();

    const { getByText, getByPlaceholderText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'abcd@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), '123456');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'abcd@gmail.com', '123456');
      expect(setDoc).toHaveBeenCalled();
    });
  });
});
