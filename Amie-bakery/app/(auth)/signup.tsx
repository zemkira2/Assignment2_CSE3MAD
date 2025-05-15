import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter()
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error ',' Please enter the full username and password');
    } else if (password !== confirmPassword) {
      Alert.alert('Error ',' Password does not match');
    } else {
      Alert.alert('Register ', ` Welcome ${username}!`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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
        <TouchableOpacity style={styles.button} onPress={() => router.push('../forgot')}>
          <Text style={styles.buttonText}>Forgot</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.Textbt} onPress={() => router.push('../Login')}>
        <Text >You have an account?</Text>
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