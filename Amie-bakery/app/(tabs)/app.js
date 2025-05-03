// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OrderHistory" 
          component={OrderHistoryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// screens/MenuScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

const menuItems = [
  { id: '1', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '2', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '3', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '4', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '5', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '6', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
  { id: '7', name: 'Banh Mi Heo Quay', price: 11, image: require('../assets/banh-mi.jpg') },
];

const MenuScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}$</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/amie-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/home-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/profile-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/menu-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Cart', { cart })}
        >
          <Image source={require('../assets/cart-icon.png')} style={styles.navIcon} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  list: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 1,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
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
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#c19a7a',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});

export default MenuScreen;

// screens/CartScreen.js
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
    // Get cart items from route params or use empty array
    const items = route.params?.cart || [];
    setCartItems(items);
    
    // Group items by their id and count quantity
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
    
    // Calculate subtotal
    const total = grouped.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [route.params]);

  const removeItem = (id) => {
    const updatedItems = [...cartItems].filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Recalculate grouped items and subtotal
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
          source={require('../assets/amie-logo.png')} 
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
            // Place order and navigate to order history
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

// screens/OrderHistoryScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

const orderHistory = [
  { 
    id: 1, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Finished"
  },
  { 
    id: 2, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Finished"
  },
  { 
    id: 3, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Finished"
  },
  { 
    id: 4, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Finished"
  },
  { 
    id: 5, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Finished"
  },
  { 
    id: 6, 
    orderNumber: "#001", 
    date: "27/3/2025", 
    total: 100, 
    status: "Delivering"
  },
];

const OrderHistoryScreen = ({ navigation }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem} 
      onPress={() => toggleOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.id}</Text>
        <View style={styles.orderDetails}>
          <Text style={styles.orderText}>Order date: {item.date}</Text>
          <Text style={styles.orderText}>Number/ID: {item.orderNumber}</Text>
        </View>
        <Text style={styles.orderTotal}>{item.total}$</Text>
        <Text style={[
          styles.orderStatus,
          item.status === "Delivering" ? styles.delivering : styles.finished
        ]}>
          {item.status}
        </Text>
      </View>
      
      {expandedOrder === item.id && (
        <View style={styles.expandedDetails}>
          <Text>Order details would appear here</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/amie-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Order History</Text>
      
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
      
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Menu')}
        >
          <Image source={require('../assets/home-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/profile-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/menu-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/cart-icon.png')} style={styles.navIcon} />
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
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 10,
  },
  orderItem: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  orderNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderText: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  finished: {
    color: 'green',
  },
  delivering: {
    color: 'red',
  },
  expandedDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#c19a7a',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});

export default OrderHistoryScreen;

// app.json
{
  "expo": {
    "name": "Amie Cafe",
    "slug": "amie-cafe",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#c19a7a"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#c19a7a"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}

// package.json
{
  "name": "amie-cafe",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~48.0.15",
    "expo-status-bar": "~1.4.4",
    "react": "18.2.0",
    "react-native": "0.71.7",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/stack": "^6.3.16",
    "react-native-gesture-handler": "~2.9.0",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "~3.20.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}