import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import OrderHistoryScreen from './OrderHistoryScreen';

jest.mock('expo-router', () => ({
  useFocusEffect: (fn: any) => fn(),
}));

jest.mock('../Firebase', () => ({
  db: {},
  auth: { currentUser: { email: 'test@example.com' } },
}));

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    collection: jest.fn(),
    getDocs: jest.fn(() =>
      Promise.resolve({
        forEach: (callback: any) => {
          callback({
            id: 'order1234',
            data: () => ({
              createdAt: { toDate: () => new Date('2025-01-01') },
              subtotal: 100,
              status: 'Delivering',
              items: [
                { id: '1', name: 'Cake', price: 50, quantity: 1 },
                { id: '2', name: 'Tea', price: 25, quantity: 2 },
              ],
              quantity: 3,
            }),
          });
        },
      })
    ),
  };
});

describe('OrderHistoryScreen', () => {
  it('renders order history and expands details', async () => {
    const { getByText, findByText } = render(<OrderHistoryScreen />);

    await findByText('Order History');

    const status = await findByText('Delivering');
    expect(status).toBeTruthy();
    expect(getByText('100$')).toBeTruthy();
    expect(getByText('Date: 1/1/2025')).toBeTruthy();

    fireEvent.press(getByText('Delivering'));
    await findByText('Cake - 50$ x 1');
    await findByText('Tea - 25$ x 2');
  });
});
