import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

const CartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const items = route.params?.cart || [];
    setCartItems(items);
    
    const itemMap = {};
    items.forEach(item => {
      if (!itemMap[item.id]) {
        itemMap[item.id] = { ...item, quantity: 1 };
      } else {
        itemMap[item.id].quantity += 1;
      }
    });
    
    const grouped = Object.values(itemMap);
    setGroupedItems(grouped);
    
    const total = grouped.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [route.params]);

  const removeItem = (id) => {
    const updatedItems = [...cartItems].filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    const itemMap = {};
    updatedItems.forEach(item => {
      if (!itemMap[item.id]) {
        itemMap[item.id] = { ...item, quantity: 1 };
      } else {
        itemMap[item.id].quantity += 1;
      }
    });
    
    const grouped = Object.values(itemMap);
    setGroupedItems(grouped);
    
    const total = grouped.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };

  const renderCartItem = ({ item }) => (
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
          onPress={() => navigation.goBack()}
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
        keyExtractor={item => item.id}
        style={styles.list}
      />
      
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.subtotalAmount}>{subtotal}$</Text>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => {
            navigation.navigate('OrderHistory');
          }}
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