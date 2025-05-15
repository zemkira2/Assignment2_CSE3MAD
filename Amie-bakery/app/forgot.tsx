import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('ERRO', 'Please enter the email address');
    } else {
      Alert.alert('Password restoration ', `A password recovery link was sent to the base ${email}`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You forgot your password.</Text>

      <Text style={styles.Text}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder=''
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send to Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Textbt} onPress={() => router.push('../Login')}>
        <Text> Back to Login !!!</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  containerlogo: {
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
    
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: 10,
    padding: 10,
    borderRadius: '100%',
    backgroundColor: '#fff',
    borderWidth: 2,

  },
  title: {
    fontSize: 20,
    fontWeight: 'thin',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  Text: {
    fontSize: 14,
    fontWeight: 'thin', 
    textAlign:'left',
    marginTop : 10,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#b5835e',
    borderRadius: 20,
    padding: 10,
    marginBottom: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
    
  },
  button: {
    backgroundColor: '#b5835e',
    paddingVertical: 10,
    width:'50%',
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',

  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    
  },
  Textbt:{
    fontSize: 20,
    marginTop: 20,
    alignItems: 'center',
  },
});