import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './Login';
import { Alert } from 'react-native';

jest.mock('../Firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inputs and login button', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('shows alert if email or password is missing', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Login'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('calls signInWithEmailAndPassword with correct credentials', async () => {
    const mockUser = { email: 'truongquyendieu22@gmail.com' };
    const { signInWithEmailAndPassword } = require('firebase/auth');
    const { getDoc } = require('firebase/firestore');

    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'truongquyendieu22@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '654321');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'truongquyendieu22@gmail.com', '654321');
    });
  });
});