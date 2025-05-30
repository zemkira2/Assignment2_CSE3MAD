import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Product from '../app/(tabs)-Admin/Product';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  Link: ({ children }: any) => children,
}));

jest.mock('../app/Firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    collection: jest.fn(() => ({})),
    getDocs: jest.fn(() => Promise.resolve({
      docs: [
        {
          id: '1',
          data: () => ({
            name: 'Cheesecake',
            price: '5.99',
            image: 'cheesecake.jpg',
          }),
        },
      ],
    })),
  };
});

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/cheesecake.jpg')),
}));

describe('Product Screen', () => {
  it('renders product list and handles navigation', async () => {
    const { findByText, getByText } = render(<Product />);

    await findByText('Cheesecake');
    expect(getByText('5.99$')).toBeTruthy();

    fireEvent.press(getByText('Cheesecake'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/UpdateProductModal',
      params: expect.objectContaining({
        id: '1',
        name: 'Cheesecake',
        price: '5.99',
      }),
    }));
  });

  it('navigates to AddProductModal on button press', async () => {
    const { getByText } = render(<Product />);
    const addButton = getByText('ADD PRODUCT');
    fireEvent.press(addButton);
  });
});
