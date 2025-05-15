import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Success', `Password reset link sent to ${email}`);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot your password?</Text>

      <Text style={styles.Text}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.Textbt} onPress={() => router.push('../Login')}>
        <Text>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, marginTop: 10, marginBottom: 10, textAlign: 'center' },
  Text: { fontSize: 14, marginTop: 10, marginBottom: 10 },
  input: { width: '100%', borderWidth: 1, borderColor: '#b5835e', borderRadius: 20, padding: 10 },
  button: { backgroundColor: '#b5835e', paddingVertical: 10, width: '50%', borderRadius: 8, marginTop: 10, alignSelf: 'center' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  Textbt: { fontSize: 16, marginTop: 20, alignItems: 'center' },
});
