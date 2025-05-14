import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, onSnapshot, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem } from '../types';

interface GroupedItem extends MenuItem {
  quantity: number;
}

const CartScreen = () => {
  const params = useLocalSearchParams();
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [userId] = useState("user1");

  useEffect(() => {
    const items: MenuItem[] = params.cart ? JSON.parse(params.cart as string) : [];

    if (items.length > 0) {
      setCartItems(items);
      updateGroupedItems(items);
      return;
    }

    const fetchCart = async () => {
      const userCartRef = doc(db, "carts", userId);
      const docSnap = await getDoc(userCartRef);

      if (docSnap.exists()) {
        const firebaseItems = docSnap.data().items as GroupedItem[];
        const expandedItems = firebaseItems.flatMap(item =>
          Array(item.quantity).fill({ id: item.id, name: item.name, price: item.price })
        );
        setCartItems(expandedItems);
        updateGroupedItems(expandedItems);
      }
    };

    fetchCart();

    const unsubscribe = onSnapshot(doc(db, "carts", userId), (docSnap) => {
      if (docSnap.exists()) {
        const firebaseItems = docSnap.data().items as GroupedItem[];
        const expandedItems = firebaseItems.flatMap(item =>
          Array(item.quantity).fill({ id: item.id, name: item.name, price: item.price })
        );
        setCartItems(expandedItems);
        updateGroupedItems(expandedItems);
      }
    });

    return () => unsubscribe();
  }, [params.cart]);

  const updateGroupedItems = (items: MenuItem[]) => {
    const itemMap: { [key: string]: GroupedItem } = {};
    items.forEach((item) => {
      if (!itemMap[item.id]) {
        itemMap[item.id] = { ...item, quantity: 1 };
      } else {
        itemMap[item.id].quantity += 1;
      }
    });
    const grouped = Object.values(itemMap);
    setGroupedItems(grouped);

    const total = grouped.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const removeItem = async (id: string) => {
    try {
      const index = cartItems.findIndex(item => item.id === id);
      if (index === -1) return;

      const updatedItems = [...cartItems];
      updatedItems.splice(index, 1);

      setCartItems(updatedItems);
      updateGroupedItems(updatedItems);

      const grouped = updatedItems.reduce((acc: { [key: string]: GroupedItem }, item) => {
        if (!acc[item.id]) acc[item.id] = { ...item, quantity: 1 };
        else acc[item.id].quantity += 1;
        return acc;
      }, {});
      const firebaseFormatted = Object.values(grouped);
      await setDoc(doc(db, "carts", userId), { items: firebaseFormatted });
    } catch (error) {
      console.error("Error removing item: ", error);
      Alert.alert("Error", "Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    if (groupedItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    try {
      await addDoc(collection(db, "orders",userId,"userOrder"), {
        items: groupedItems,
        subtotal,
        status: "pending",
        createdAt: new Date(),
      });

      await setDoc(doc(db, "carts", userId), { items: [] });

      Alert.alert("Success", "Your order has been placed!");
      router.replace('/OrderHistoryScreen');
    } catch (error) {
      console.error("Error during checkout: ", error);
      Alert.alert("Error", "Failed to place order");
    }
  };

  const renderCartItem = ({ item }: { item: GroupedItem }) => (
    <View style={styles.cartItem}>
      <Text style={styles.quantityText}>{item.quantity}x</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <Text style={styles.itemPrice}>
        {item.price * item.quantity}$
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={groupedItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.subtotalAmount}>{subtotal}$</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    width: 30,
    textAlign: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    fontSize: 20,
  },
  subtotalContainer: {
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtotalAmount: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
