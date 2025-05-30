import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddToCartScreen from '../app/AddToCartScreen';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'test_id' }),
  router: { back: jest.fn() },
}));

jest.mock('../app/Firebase', () => ({
  db: {},
  auth: { currentUser: { email: 'test@example.com' } },
}));

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');

  return {
    ...original,
    doc: jest.fn((_, collection, docId) => ({
      id: docId,
      path: `${collection}/${docId}`,
    })),
    getDoc: jest.fn((docRef) => {
      if (docRef.path.startsWith('products/')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({
            name: 'Test Product',
            price: 20,
            image: 'test-image.jpg',
          }),
        });
      }

      if (docRef.path.startsWith('carts/')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({
            items: [],
          }),
        });
      }

      return Promise.resolve({
        exists: () => false,
      });
    }),
    setDoc: jest.fn(),
  };
});

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(async () => 'https://example.com/image.jpg'),
}));

test('increase and decrease quantity buttons work correctly', async () => {
  const { findByTestId, findByText } = render(<AddToCartScreen />);

  const increaseButton = await findByTestId('increase-button');
  const decreaseButton = await findByTestId('decrease-button');

  // Initial quantity = 1
  await findByText('1');

  // Increase quantity
  fireEvent.press(increaseButton);
  await findByText('2');

  // Decrease quantity
  fireEvent.press(decreaseButton);
  await findByText('1');
});
