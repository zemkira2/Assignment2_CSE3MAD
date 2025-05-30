import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import Delivery from "../app/(tabs)-Admin/Delivery";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("../app/Firebase", () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    collection: jest.fn((db, ...pathSegments) => {
      return { _path: { segments: pathSegments } };
    }),
    getDocs: jest.fn(async (ref) => {
      const path = ref._path?.segments?.join('/');

      if (path === 'users') {
        return {
          empty: false,
          forEach: (cb: any) => {
            cb({ data: () => ({ email: 'user1@example.com', role: 'customer' }) });
            cb({ data: () => ({ email: 'admin@example.com', role: 'admin' }) });
          },
        };
      }

      if (path === 'orders/user1@example.com/userOrder') {
        return {
          forEach: (cb: any) => {
            cb({
              id: 'order001',
              data: () => ({
                createdAt: { toDate: () => new Date('2024-01-01') },
                address: '123 Test St',
                items: [{ id: '1', name: 'Cake', price: 10 }],
                quantity: 1,
                subtotal: 10,
                status: 'pending',
              }),
            });
          },
        };
      }

      return { empty: true, forEach: () => {} };
    }),
  };
});

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useFocusEffect: (cb: any) => {
      const React = require("react");
      React.useEffect(cb, []);
    },
  };
});
describe("Delivery Screen", () => {
  it("renders orders correctly and navigates on press", async () => {
    const { getByText, findByText } = render(<Delivery />);

    await findByText("OrderID: order001");
    expect(getByText("User: user1@example.com")).toBeTruthy();
    expect(getByText("pending")).toBeTruthy();

    // Simulate press
    fireEvent.press(getByText("OrderID: order001"));
    const { router } = require("expo-router");
    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "../orderDetail",
        params: expect.objectContaining({
          numberId: "order001",
          email: "user1@example.com",
        }),
      })
    );
  });
});
