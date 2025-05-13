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
        setCartItems(firebaseItems);
        updateGroupedItems(firebaseItems);
      }
    };

    fetchCart();

    const unsubscribe = onSnapshot(doc(db, "carts", userId), (doc) => {
      if (doc.exists()) {
        const firebaseItems = doc.data().items as GroupedItem[];
        setCartItems(firebaseItems);
        updateGroupedItems(firebaseItems);
      }
    });

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
      await setDoc(doc(db, "carts", userId), { items: updatedItems }, { merge: true });
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
      await addDoc(collection(db, "orders"), {
        items: groupedItems,
        subtotal: subtotal,
        status: "pending",
        userId: userId,
        createdAt: new Date()
      });

      await setDoc(doc(db, "carts", userId), { items: [] });

      Alert.alert("Success", "Your order has been placed!");
      router.push('/OrderHistoryScreen');
    } catch (error) {
      console.error("Error during checkout: ", error);
      Alert.alert("Error", "Failed to place order");
    }
  };

  const renderCartItem = ({ item }: { item: GroupedItem }) => (
    <View style={styles.card}>
      <Text style={styles.quantity}>{item.quantity}x</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>
        {item.quantity > 1 ? `${item.price * item.quantity}$` : `${item.price}$`}
      </Text>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.delete}>🗑️</Text>
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
        contentContainerStyle={styles.list}
      />

      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalLabel}>Subtotal</Text>
        <Text style={styles.subtotalAmount}>{subtotal}$</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA',
  },
  header: {
    backgroundColor: '#B5835E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quantity: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  edit: {
    color: 'blue',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  delete: {
    fontSize: 20,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  subtotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#b47b51',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 3,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});