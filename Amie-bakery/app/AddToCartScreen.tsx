// app/AddToCartScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { MenuItem } from './types';

const AddToCartScreen = () => {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const itemId = Array.isArray(id) ? id[0] : id;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const userId = 'user1';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'products', itemId);
        const docRefCart = doc(db, 'carts', userId);
        const docSnapCart = await getDoc(docRefCart);
        const docSnap = await getDoc(docRef);
        if (docSnapCart.exists()) {
          const cartData = docSnapCart.data();
          const existingItem = cartData.items.find((item: MenuItem) => item.id === itemId);
          if (existingItem) {
            setQuantity(existingItem.quantity);
          }
        }
        if (docSnap.exists()) {
          const data = docSnap.data();
          const storage = getStorage();
          const imageRef = ref(storage, 'images/' + data.image);
          const imageUrl = await getDownloadURL(imageRef);

          setItem({
            id: itemId,
            name: data.name,
            price: data.price,
            image: imageUrl,
          });
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const increaseQty = () => setQuantity(quantity + 1);
  const decreaseQty = () => setQuantity(Math.max(1, quantity - 1));

  const handleAddToCart = async () => {
    if (!item) return;
    try {
      const userCartRef = doc(db, 'carts', userId);
      const docSnap = await getDoc(userCartRef);
      let updatedItems = [];

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items;
        const index = existingItems.findIndex((i: MenuItem) => i.id === item.id);
        if (index !== -1) {
          existingItems[index].quantity = quantity;
        } else {
          existingItems.push({ ...item, quantity });
        }
        updatedItems = existingItems;
      } else {
        updatedItems = [{ ...item, quantity }];
      }

      await setDoc(userCartRef, { items: updatedItems }, { merge: true });
      router.back();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading || !item) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B5835E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}$</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQty} style={styles.qtyButton}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{quantity}</Text>
        <TouchableOpacity onPress={increaseQty} style={styles.qtyButton}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddToCartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5E9DA',
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  qtyButton: {
    backgroundColor: '#b47b51',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  qtyText: {
    color: 'white',
    fontSize: 20,
  },
  qtyNumber: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: '#B5835E',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
