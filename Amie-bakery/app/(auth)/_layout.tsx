import { Stack } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/amie-logo.png')}
          style={styles.logo}
        />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA', // Light beige
  },
  logoContainer: {
    backgroundColor: '#B5835E', // Brown header
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 20,
  },
});