import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FontAwesome from '@expo/vector-icons/FontAwesome'; 

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
        style={styles.input1}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#fff"
      />
     <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonLabel}>Login</Text>
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
    marginLeft: 5,
  },
  text: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "900",
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