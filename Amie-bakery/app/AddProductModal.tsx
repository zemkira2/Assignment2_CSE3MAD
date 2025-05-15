import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
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
import{router} from 'expo-router';
import { doc, setDoc,addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";


export default function AddProductModal(){
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const handleSave = async () => {  
    if (!name || !price || !image) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name,
        price,
        image,
      });
      await setDoc(doc(db, "products", docRef.id), {
        id: docRef.id,
        name,
        price,
        image,
      });
      // alert("Product saved with ID: " + docRef.id);
      router.replace('/(tabs)-Admin/Product'); // forces reloading the product screen
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };


  const handleDelete = () => {
    setName("");
    setPrice("");
    setImage(null);
    console.log("Form reset");
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
    const uri = result.assets[0].uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    setImage(filename);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Uploaded successfully!');
      console.log('Download URL:', downloadURL);
    } catch (error) {
      console.error('Upload failed:', error);
    }
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>ResetForm</Text>
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

