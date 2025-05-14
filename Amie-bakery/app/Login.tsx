import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Username và Password');
    } else {
      Alert.alert('Đăng nhập', `Chào mừng ${username}!`);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <view style={styles.containerlogo}>
      <Image source={require('@/assets/images/amie-logo.png')} style={styles.logo} /></view>
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
      <View style={styles.buttonRow} >
        <TouchableOpacity style={styles.button} onPress={() => router.push('../../signup')}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.Textbt} onPress={() => router.push('../,,/forgot')}>
        <Text >Forgot password?</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 100,
    backgroundColor: '#fff',
  },
  containerlogo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',

  },
  title: {
    fontSize: 28,
    fontWeight: 'thin',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  Text: {
    fontSize: 28,
    fontWeight: 'thin', 
    textAlign:'left',
    marginTop : 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#b5835e',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
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
    width:'50%',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Textbt:{
    flexDirection: 'row',
    fontSize: 20,
    marginTop: 20,
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: 40,
  marginBottom: 30, 
    padding: 90,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,

  },
});