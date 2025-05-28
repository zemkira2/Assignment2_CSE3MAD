import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CartScreen from "./CartScreen";
import { getDoc, setDoc, addDoc } from "firebase/firestore";
import { router } from "expo-router";

(global as any).setImmediate = (fn: () => void) => setTimeout(fn, 0);

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

jest.mock("../Firebase", () => ({
  db: {},
  auth: {
    currentUser: { email: "truongquyendieu22@gmail.com" },
  },
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ exists: () => false });
    return () => {};
  }),
  collection: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    cart: JSON.stringify([
      { id: "1", name: "Cake", price: 10, image: "" },
      { id: "1", name: "Cake", price: 10, image: "" },
    ]),
  }),
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (cb: any) => {
      React.useEffect(cb, []);
    },
  };
});

describe("CartScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ address: "Default Address", phone: "0000000000" }),
    });
  });

  it("renders cart items correctly", async () => {
    const { getByText, getAllByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText("2x")).toBeTruthy();
      expect(getByText("Cake")).toBeTruthy();
      expect(getAllByText("20$").length).toBeGreaterThanOrEqual(1);
      expect(getByText("Checkout")).toBeTruthy();
    });
  });

  it("shows error if address is missing on checkout", async () => {
    const alertMock = require("react-native/Libraries/Alert/Alert").alert;

    // Override mock để không có address
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({}),
    });
    (addDoc as jest.Mock).mockResolvedValue({});
    (setDoc as jest.Mock).mockResolvedValue({});
    const { getByText } = render(<CartScreen />);
    const checkoutButton = await waitFor(() => getByText("Checkout"));

    fireEvent.press(checkoutButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Update Address",
        expect.stringContaining("Please update your delivery address")
      );
    });
  });

  it("checkout successfully with valid address", async () => {
    (addDoc as jest.Mock).mockResolvedValue({});
    (setDoc as jest.Mock).mockResolvedValue({});

    const { getByText } = render(<CartScreen />);
    const checkoutButton = await waitFor(() => getByText("Checkout"));

    fireEvent.press(checkoutButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith("./OrderHistoryScreen");
    });
  });
});
