import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if(!user.email) {
          Alert.alert("Error", "User email not found");
          return;
        }
        const userDoc = await getDoc(doc(db, "users", user.email));
        if (userDoc.exists()) {
          const { role } = userDoc.data();
          if (role === "admin") {
            router.push("/(tabs)-Admin/Product");
          } else {
            const cartRef = doc(db, "carts", email);
            const existingCart = await getDoc(cartRef);
            if (!existingCart.exists()) {
              await setDoc(cartRef, { items: [] });
            }
            router.push({
              pathname: "/(tabs)-Customer/MenuScreen",
            });
          }
        } else {
          Alert.alert("Error", "User role not found in Firestore");
        }
      } catch (error: any) {
        Alert.alert("Login Failed", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("../signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push("../forgot")}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  label: { fontSize: 16, color: "#333", marginBottom: 6 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#B5835E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: { flex: 1, paddingVertical: 12, borderRadius: 10 },
  signupButton: { backgroundColor: "#ccc", marginRight: 10 },
  loginButton: { backgroundColor: "#B5835E" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  forgotPassword: { marginTop: 16, alignItems: "center" },
  forgotText: { color: "#555", fontSize: 14 },
});
