import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

const orderHistory: Order[] = [
  { id: 1, orderNumber: '#001', date: '27/3/2025', total: 100, status: 'Finished' },
  { id: 2, orderNumber: '#002', date: '27/3/2025', total: 100, status: 'Finished' },
  { id: 3, orderNumber: '#003', date: '27/3/2025', total: 100, status: 'Finished' },
  { id: 4, orderNumber: '#004', date: '27/3/2025', total: 100, status: 'Finished' },
  { id: 5, orderNumber: '#005', date: '27/3/2025', total: 100, status: 'Finished' },
  { id: 6, orderNumber: '#006', date: '27/3/2025', total: 100, status: 'Delivering' },
];

const OrderHistoryScreen = () => {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleOrderDetails(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>{item.id}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>Date: {item.date}</Text>
          <Text style={styles.orderText}>ID: {item.orderNumber}</Text>
        </View>
        <Text style={styles.total}>{item.total}$</Text>
        <Text
          style={[
            styles.status,
            item.status === 'Delivering' ? styles.delivering : styles.finished,
          ]}
        >
          {item.status}
        </Text>
      </View>
      {expandedOrder === item.id && (
        <View style={styles.expandedDetails}>
          <Text style={styles.detailsText}>Order details would appear here</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

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
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderText: {
    fontSize: 14,
    color: '#333',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  delivering: {
    color: '#d9534f',
  },
  finished: {
    color: '#5cb85c',
  },
  expandedDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
  },
});
