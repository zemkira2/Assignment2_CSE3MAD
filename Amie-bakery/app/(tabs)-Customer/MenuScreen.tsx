import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MenuItem } from "../types";
import { doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from "../Firebase";


const MenuScreen = () => {
  const param = useLocalSearchParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const email = auth.currentUser?.email;


  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const storage = getStorage();

      const items: MenuItem[] = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageRef = ref(storage, "images/" + data.image);
          const imageUrl = await getDownloadURL(imageRef);
          return {
            id: doc.id,
            name: data.name,
            price: data.price,
            image: imageUrl,
          };
        })
      );

      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const goToAddToCartScreen = (item: MenuItem) => {
    router.push({
      pathname: "../AddToCartScreen",
      params: {
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        image: item.image,
        email: email,
      },
    });
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}$</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => goToAddToCartScreen(item)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.MainContainer}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#F5E9DA",
  },
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#b47b51",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
