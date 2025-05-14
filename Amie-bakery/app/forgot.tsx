import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image, Alert } from 'react-native';

export default function ForgotScreen() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('');
    } else {
      Alert.alert('Password recovery', ` ${email}`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You forgot your password.</Text>
      <view style={styles.containerlogo}>
      <Image source={require('../../assets/images/amie-logo.png')} style={styles.logo} /></view>
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
    </View>
  );
}


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 100,
      paddingTop: 50,
      backgroundColor: '#fff',
      alignItems: 'center',
    },                  
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
    Text: {
      fontSize: 16,
      marginBottom: 10,
      alignSelf: 'flex-start',
      marginLeft: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    input: {               
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        },      
    button: {
        backgroundColor: '#b5835e',
        paddingVertical: 15,     
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonRow: {
      flexDirection: 'row',    
      marginTop: 20,       
      gap: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText2: {
    color: '#b5835e',     
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
    },
    Textbt:{
      flexDirection: 'row',
      fontSize: 20,
      marginTop: 20,
      gap: 1,
      justifyContent: 'center',
      alignItems: 'center',             
    },
    Textbt2:{
      fontSize: 20,
      marginTop: 20,
      gap: 1,           
        justifyContent: 'center',       
        alignItems: 'center',
        color: '#000',
        fontWeight: 'bold', 

    },
containerlogo: {
  flexDirection: 'row',
    justifyContent: 'center',   
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },

});