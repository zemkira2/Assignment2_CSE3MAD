import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserInformationScreen from './UserInformationScreen';
import { act } from 'react-test-renderer';

// Mocks cho Firebase và Expo Router
jest.mock('../Firebase', () => ({
  db: {},
  auth: {
    currentUser: { email: 'test@example.com' },
    signOut: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    doc: jest.fn((_, collection, id) => ({ path: `${collection}/${id}` })),
    getDoc: jest.fn(async () => ({
      exists: () => true,
      data: () => ({ address: 'Mock Street', phone: '0000000000' }),
    })),
    setDoc: jest.fn(),
  };
});
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
}));
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

describe('UserInformationScreen', () => {
  it('renders all input fields and buttons', async () => {
    const { findByPlaceholderText, findByText } = render(<UserInformationScreen />);

    await findByText('User');
    await findByPlaceholderText('Email');
    await findByPlaceholderText('Address');
    await findByPlaceholderText('Phone Number');
    await findByText('Save');
    await findByText('Log out');
  });

  it('fills in address and phone number and saves info', async () => {
    const { findByPlaceholderText, findByText } = render(<UserInformationScreen />);

    const addressInput = await findByPlaceholderText('Address');
    const phoneInput = await findByPlaceholderText('Phone Number');
    const saveButton = await findByText('Save');

    fireEvent.changeText(addressInput, '123 New Street');
    fireEvent.changeText(phoneInput, '0987654321');
    fireEvent.press(saveButton);

    await waitFor(() => {
      const { setDoc } = require('firebase/firestore');
      expect(setDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'users/test@example.com' }),
        expect.objectContaining({
          address: '123 New Street',
          phone: '0987654321',
          email: 'test@example.com',
        }),
        { merge: true }
      );
    });
  });

  it('logs out when Log out button is pressed', async () => {
    const { findByText } = render(<UserInformationScreen />);
    const logoutButton = await findByText('Log out');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      const { auth } = require('../Firebase');
      expect(auth.signOut).toHaveBeenCalled();
    });
  });
});
