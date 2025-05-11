import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MenuItem } from '../types';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, onSnapshot, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

interface GroupedItem extends MenuItem {
  quantity: number;
}

const CartScreen = () => {
  const params = useLocalSearchParams();
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [userId] = useState("user1"); // In a real app, get this from your auth system

  useEffect(() => {
  // First check for params (if coming from MenuScreen)
  const items: MenuItem[] = params.cart ? JSON.parse(params.cart as string) : [];
  if (items.length > 0) {
    setCartItems(items);
    updateGroupedItems(items);
    return;
  }

  // If no params, fetch from Firebase
  const fetchCart = async () => {
    const userCartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(userCartRef);

    if (docSnap.exists()) {
      const firebaseItems = docSnap.data().items as GroupedItem[];
      setCartItems(firebaseItems);
      updateGroupedItems(firebaseItems);
    }
  };

  fetchCart();

  // Set up real-time listener
  const unsubscribe = onSnapshot(doc(db, "carts", userId), (doc) => {
    if (doc.exists()) {
      const firebaseItems = doc.data().items as GroupedItem[];
      setCartItems(firebaseItems);
      updateGroupedItems(firebaseItems);
    }
  }); // <-- Add this closing parenthesis here

  return () => unsubscribe();
  }, []);

  const updateGroupedItems = (items: MenuItem[]) => {
    const itemMap: { [key: string]: GroupedItem } = {};
    items.forEach((item: MenuItem) => {
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
      const updatedItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedItems);
      updateGroupedItems(updatedItems);

      // Update Firebase
      const userCartRef = doc(db, "carts", userId);
      await setDoc(userCartRef, { items: updatedItems }, { merge: true });
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
      // Create order in orders collection
      const orderRef = await addDoc(collection(db, "orders"), {
        items: groupedItems,
        subtotal: subtotal,
        status: "pending",
        userId: userId,
        createdAt: new Date()
      });

      // Clear the cart
      await setDoc(doc(db, "carts", userId), { items: [] });

      Alert.alert("Success", "Your order has been placed!");
      router.push('/OrderHistoryScreen');
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
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemPrice}>
        {item.quantity > 1 ? `${item.price * item.quantity}$` : `${item.price}$`}
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/amie-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#c19a7a',
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 35,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
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
  editText: {
    color: 'blue',
    marginTop: 5,
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

export default CartScreen;