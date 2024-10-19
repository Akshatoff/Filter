import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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


export default function loginScreen() {
   const [email, setEmail] = useState<string>('');  // Explicitly define state types
  const [password, setPassword] = useState<string>('');
  const router = useRouter();


  const handleLogin = () => {
    const auth = getAuth(app); // Get the auth instance
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/(tabs)' as never); // Ensure the path exists in your app
      })
      .catch(error => Alert.alert("Login Error", error.message));
  };
  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => router.push('/(auth)/register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, color:"#fff", }
});