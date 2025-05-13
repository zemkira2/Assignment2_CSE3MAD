import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams,router } from 'expo-router';

export default function OrderDetail() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Order details</Text>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>NumberID: #001</Text>
        <Text style={styles.date}>Date: 27/3/2025</Text>

        {/* Order Items */}
        <View style={styles.items}>
          <Text style={styles.item}>
            2x Banh mi <Text style={styles.price}>$100</Text>
          </Text>
          <Text style={styles.item}>
            3x Carrot <Text style={styles.price}>$200</Text>
          </Text>
          <Text style={styles.item}>
            5x Potato cake <Text style={styles.price}>$300</Text>
          </Text>
          <Text style={styles.item}>
            3x Pork <Text style={styles.price}>$500</Text>
          </Text>
          <Text style={styles.item}>
            5x pate <Text style={styles.price}>$400</Text>
          </Text>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>$1500</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Address</Text>
        <Text style={styles.address}>1 Orion ave, st albans</Text>
        <Text style={styles.address}>Kingsbury, Melbourne, Vic 3021</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: -37.8136, longitude: 144.9631 }}
          title="Delivery Location"
        >
        </Marker>
      </MapView>

      {/* Finish Button */}
      <TouchableOpacity style={styles.finishButton}>
        <Text style={styles.finishButtonText}>FINISH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  orderInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  items: {
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B5835E',
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  marker: {
    width: 40,
    height: 40,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});