import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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


export default function RootLayout() {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as never); // Set the user when authenticated
    });

    return () => unsubscribe(); // Clean up the listener
  }, [auth]);


  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <Stack>
      {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
    </ThemeProvider>
  );
}
