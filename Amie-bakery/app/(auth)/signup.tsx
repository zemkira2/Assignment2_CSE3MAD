import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please enter all fields');
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.email) {
          Alert.alert('Error', 'User email not found');
          return;
        }
        await setDoc(doc(db, 'users', user.email), {
          email,
          role,
        });

        Alert.alert('Success', 'Account created!');
        router.push('../Login');
      } catch (error: any) {
        Alert.alert('Sign Up Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.Text}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.Text}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.Text}>Confirm Password</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Text style={styles.Text}>Select Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity onPress={() => setRole('customer')}>
          <Text style={[styles.roleText, role === 'customer' && styles.selectedRole]}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('admin')}>
          <Text style={[styles.roleText, role === 'admin' && styles.selectedRole]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('../forgot')}>
          <Text style={styles.buttonText}>Forgot</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.Textbt} onPress={() => router.push('../Login')}>
        <Text>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, marginTop: 10, marginBottom: 10, textAlign: 'center' },
  Text: { fontSize: 14, marginTop: 10, marginBottom: 10 },
  input: { width: '100%', borderWidth: 1, borderColor: '#b5835e', borderRadius: 20, padding: 10 },
  roleContainer: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  roleText: { fontSize: 16, color: '#000' },
  selectedRole: { fontWeight: 'bold', color: '#b5835e' },
  buttonRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  button: { backgroundColor: '#b5835e', paddingVertical: 10, width: '50%', borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  Textbt: { fontSize: 16, marginTop: 20, alignItems: 'center' },
});
