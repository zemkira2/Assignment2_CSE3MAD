import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter()
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('');
    } else if (password !== confirmPassword) {
      Alert.alert('');
    } else {
      Alert.alert('', ` Wellcome ${username}!`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <view style={styles.containerlogo}>
        <Image source={require('../../assets/images/amie-logo.png')} style={styles.logo} /></view>
      <Text style={styles.Text}>Fullname</Text>
      <TextInput
        style={styles.input}
        placeholder=''
        value={fullname}
        onChangeText={setFullname}
      />
      <Text style={styles.Text}>User</Text>
      <TextInput
        style={styles.input}
        placeholder=''
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.Text}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder=''
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.Text}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder=''
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleSignUp()}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('../../forgot')}>
          <Text style={styles.buttonText}>Forgot</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.Textbt}>
        <Text >You have an account?</Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 100,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  containerlogo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    paddingTop: 20,
    marginTop: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#b5835e',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'thin',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  Text: {
    fontSize: 18,
    fontWeight: 'thin',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#b5835e',
    borderRadius: 20,
    padding: 12,
    marginBottom: 1
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#b5835e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '50%',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  Textbt: {
    flexDirection: 'row',
    fontSize: 30,
    marginTop: 20,
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b5835e',
  },
  buttonTextbt: {
    color: '#b5835e',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  buttonbt: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '50%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b5835e',
  },
},
);
