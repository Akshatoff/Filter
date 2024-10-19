import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const firebaseConfig = {
  apiKey: "AIzaSyA2ujqbvfFLA0Gy88reFq0mZL_6EcKd-t0",
  authDomain: "filter-4fb70.firebaseapp.com",
  projectId: "filter-4fb70",
  storageBucket: "filter-4fb70.appspot.com",
  messagingSenderId: "746487711981",
  appId: "1:746487711981:web:2171a6015357950cc664e4",
  measurementId: "G-KQJ0D4RDVF"
};
const app = initializeApp(firebaseConfig);


export default function RegisterScreen() {
   const [email, setEmail] = useState<string>('');  // Explicitly define state types
  const [password, setPassword] = useState<string>('');
  const router = useRouter();


  const handleRegister = () => {
    const auth = getAuth(app); // Get Firebase auth instance
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/(tabs)' as never); // Navigate to home after successful registration
      })
      .catch(error => Alert.alert("Registration Error", error.message));
  };


  return (
    <View style={styles.container}>
      <Text>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
         placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
         placeholderTextColor="#fff"
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => router.push('/(auth)/' as never)} // Navigate to login screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8,color:"#fff" }
});