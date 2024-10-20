import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
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
const heroimg = require("@/assets/images/danger.png")

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
      <View style={styles.imgContainer}>
        <Image source={heroimg} style={styles.image}></Image>
      </View>
      <Text style={styles.text}>The Only Verification You Need</Text>
      <View style={styles.textcontainer}>
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
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonLabel}>Register</Text>
      </Pressable>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor:"#101010", },
  input: { height: 40, borderColor: '#f75e4e', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, color:"#fff", },
  input1: { height: 40, borderColor: '#f75e4e', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, color:"#fff",},
  imgContainer: {
    flex:1,
  },
  image: {
    width: "100%",
    height: "100%",
    marginLeft: 50,
  },
  text: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    width: 200,
    marginBottom: 20,
    
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#fff",
    color: "black",
    borderColor: "#f75e4e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 50,
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
  },
  textcontainer: {
   
  }
});