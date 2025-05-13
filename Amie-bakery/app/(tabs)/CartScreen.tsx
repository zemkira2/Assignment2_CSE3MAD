import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MenuItem } from '../types';

interface GroupedItem extends MenuItem {
  quantity: number;
}

const CartScreen = () => {
  const params = useLocalSearchParams();
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    const passedCart = params.cart ? JSON.parse(params.cart as string) : [];
    setGroupedItems(passedCart);

    const total = passedCart.reduce(
      (sum: number, item: GroupedItem) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, []);

  const renderItem = ({ item }: { item: GroupedItem }) => (
    <View style={styles.card}>
      <Text style={styles.quantity}>{item.quantity}x</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.price}>{item.price * item.quantity}$</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={groupedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalLabel}>Subtotal</Text>
        <Text style={styles.subtotalAmount}>{subtotal}$</Text>
      </View>
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
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
