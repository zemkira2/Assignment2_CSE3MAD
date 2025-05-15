import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router, Link } from "expo-router";
import React, { useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from "../Firebase";
type MenuItem = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export default function Product() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const storage = getStorage();

      const items: MenuItem[] = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageRef = ref(storage, "images/"+data.image);
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
  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/UpdateProductModal",
          params: {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
        })
      }
    >
      <View style={styles.card}>
        <Image src={item.image} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}$</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.MainContainer}>
      <View style={styles.listContainer}>
        <FlatList
          style={{ width: "100%", height: "88%" }}
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      </View>
      <Link href="/AddProductModal" asChild>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>ADD PRODUCT</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2, // for Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    padding: 5,
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
  listContainer: {
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 5,
  },
  MainContainer: {
    backgroundColor: "#F5E9DA", // Light beige background
    padding: 5,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#b47b51",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
