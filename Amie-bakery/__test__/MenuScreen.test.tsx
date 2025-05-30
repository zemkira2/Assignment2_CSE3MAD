import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import MenuScreen from '../app/(tabs)-Customer/MenuScreen';
import { getDocs } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
global.setImmediate = global.setImmediate || ((fn: () => void) => setTimeout(fn, 0));

jest.mock('../app/Firebase', () => ({
  db: {},
  auth: {
    currentUser: { email: 'test@example.com' },
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn((_, path) => path),
  getDownloadURL: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
}));

describe('MenuScreen', () => {
  it('fetches and displays menu items', async () => {
    // Mock dữ liệu menu item
    const fakeItems = [
      {
        id: '1',
        data: () => ({
          name: 'Cake',
          price: 5,
          image: 'cake.png',
        }),
      },
    ];

    // Firebase mocks
    (getDocs as jest.Mock).mockResolvedValue({ docs: fakeItems });
    (getDownloadURL as jest.Mock).mockResolvedValue('https://example.com/cake.png');

    const { getByText } = render(<MenuScreen />);

    await waitFor(() => {
      expect(getByText('Cake')).toBeTruthy();
      expect(getByText('5$')).toBeTruthy();
      expect(getByText('Add')).toBeTruthy();
    });
  });

  it('navigates to AddToCartScreen on press', async () => {
    const { router } = require('expo-router');

    const fakeItems = [
      {
        id: '1',
        data: () => ({
          name: 'Coffee',
          price: 3,
          image: 'coffee.png',
        }),
      },
    ];

    (getDocs as jest.Mock).mockResolvedValue({ docs: fakeItems });
    (getDownloadURL as jest.Mock).mockResolvedValue('https://example.com/coffee.png');

    const { getByText } = render(<MenuScreen />);
    await waitFor(() => getByText('Add'));

    fireEvent.press(getByText('Add'));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '../AddToCartScreen',
      params: {
        id: '1',
        name: 'Coffee',
        price: '3',
        image: 'https://example.com/coffee.png',
        email: 'test@example.com',
      },
    });
  });
});
