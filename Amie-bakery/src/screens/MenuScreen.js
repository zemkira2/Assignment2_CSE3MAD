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
  { id: '1', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '2', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '3', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '4', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '5', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '6', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
  { id: '7', name: 'Banh Mi Heo Quay', price: 11, image: require('../../assets/banh-mi.jpg') },
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
          source={require('../../assets/amie-logo.png')} 
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
          <Image source={require('../../assets/home-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/profile-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/menu-icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Cart', { cart })}
        >
          <Image source={require('../../assets/cart-icon.png')} style={styles.navIcon} />
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