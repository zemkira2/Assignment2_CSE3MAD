// screens/OrderHistoryScreen.tsx
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
import { useNavigation } from 'expo-router';
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
       <Text
         style={[
           styles.orderStatus,
           item.status === 'Delivering' ? styles.delivering : styles.finished,
         ]}
       >
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
         source={require('../../assets/amie-logo.png')}
         style={styles.logo}
         resizeMode="contain"
       />
     </View>
     <Text style={styles.title}>Order History</Text>
     <FlatList
       data={orderHistory}
       renderItem={renderOrderItem}
       keyExtractor={(item) => item.id.toString()}
       style={styles.list}
     />
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
   alignItems: 'center',
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
