import React, { useState } from "react";
import { router } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "./Firebase";
import { doc,deleteDoc} from "firebase/firestore";
import { useLocalSearchParams } from 'expo-router';
import { updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';


export default function UpdateProductModal({visible,onClose,}: {visible: boolean;onClose: () => void;}){
    const params = useLocalSearchParams();
    const [editingId, setEditingId] = useState<string | null>(params.id as string || null);
    const [name, setName] = useState<string>(params.name as string || "");
    const [price, setPrice] = useState<string>(params.price as string || "");
    const [image, setImage] = useState<string | null>(params.image as string || null);
  const handleUpdate = async () => {
    // Simulate image upload for now
    try {
        if (editingId) {
          // 🔁 UPDATE existing product
          const productRef = doc(db, "products", editingId);
          await updateDoc(productRef, { name, price, image });
          alert("Product updated!");
          router.replace('/Product'); // forces reloading the product screen
        } 
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save product");
      }
    };


  const handleDelete = async () => {
    
    try {
        if (editingId) {
            const productRef = doc(db, "products", editingId);
            await deleteDoc(productRef);
            alert("Product deleted!");
            router.replace('/Product');} // forces reloading the product screen
    }catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete product");
      }
    };

  const handleImageUpload = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter product name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter product price"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.imageUploadText}>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5E9DA",
    padding: 20,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  imageUploadButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageUploadText: {
    color: "#b47b51",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

