import { Image, StyleSheet, Text,View, FlatList, TouchableOpacity} from 'react-native';

const menuItems = [
  {
    id: '1',
    name: 'Banh Mi Heo Quay',
    price: '11$',
    image: require('../../assets/images/banhmi.png'), // change path as needed
  },
  // You can duplicate for demo or map actual data
  { id: '2', name: 'Banh Mi Heo Quay', price: '11$', image: require('../../assets/images/banhmi.png') },
  { id: '3', name: 'Banh Mi Heo Quay', price: '11$', image: require('../../assets/images/banhmi.png') },
  { id: '4', name: 'Banh Mi Heo Quay', price: '11$', image: require('../../assets/images/banhmi.png') },
  { id: '5', name: 'Banh Mi Heo Quay', price: '11$', image: require('../../assets/images/banhmi.png') },
];

export default function HomeScreen() {
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );
  return (
    <View style={styles.MainContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo}></Image>,
      <View style={styles.listContainer}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>ADD PRODUCT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo:{
    marginTop:60,
    margin:"auto",
    width: 120,
    height: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer:{
    backgroundColor:"white",
    marginTop:10
  },
  MainContainer:{
    backgroundColor:"#B5835E"
  },
  button: {
    marginTop: 20,
    backgroundColor: '#b47b51',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
