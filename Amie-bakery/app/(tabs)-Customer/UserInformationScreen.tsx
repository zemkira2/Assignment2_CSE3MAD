import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../Firebase";

const UserInformationScreen = () => {
  const [email] = useState(auth.currentUser?.email || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [addressFocused, setAddressFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAddress(data.address || "");
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("../(auth)/Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSave = async () => {
    if (!address || !phone) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No user logged in");
        return;
      }
      await setDoc(
        doc(db, "users", email),
        { address, phone, email },
        { merge: true }
      );
      alert("Information saved!");
    } catch (error) {
      console.error("Error saving information:", error);
      alert("Failed to save information.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>User</Text>

          <View style={styles.iconContainer}>
            <MaterialIcons name="account-circle" size={60} color="#231F20" />
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false}
            placeholder="Email"
            placeholderTextColor="#b47b51"
          />

          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={[styles.input, addressFocused && styles.inputFocused]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            placeholderTextColor="#b47b51"
            onFocus={() => setAddressFocused(true)}
            onBlur={() => setAddressFocused(false)}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, phoneFocused && styles.inputFocused]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            placeholderTextColor="#b47b51"
            keyboardType="phone-pad"
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UserInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E9DA",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 2,
    fontSize: 16,
    fontWeight: "500",
    color: "#231F20",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#b47b51",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#231F20",
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: "#B5835E",
    shadowColor: "#B5835E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: "#b47b51",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "70%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#b5835e",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
