import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Button, View, Alert, Text, FlatList, Linking, KeyboardAvoidingView, Platform, TextInput, ScrollView, Image, Pressable } from 'react-native';
import OpenAI from "openai";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons'

interface HistoryItem {
  id: string;
  verifiedText: string;
  verificationResponse: string;
  timestamp: number;
}

const $OPENROUTER_API_KEY = "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";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: $OPENROUTER_API_KEY,
});

interface Article {
  uuid: string;
  title: string;
  snippet: string;
  url: string;
}

// Define the structure of the Sightengine API response
interface SightengineResponse {
  status: string;
  request: {
    id: string;
    timestamp: number;
    operations: number;
  };
  type: {
    ai_generated: number;
  };
}

export default function HomeScreen() {
  
    const router = useRouter();
    const redirct = () => {
     router.push('/(tabs)/verification' as never); // Ensure the path exists in your app
          
    }
    const redircttohistory = () => {
        router.push('/(tabs)/history' as never); // Ensure the path exists in your app
             
       }
       const redirecttoimage = () => {
        router.push('/(tabs)/imageverification' as never); // Ensure the path exists in your app
             
       }
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.dashboardhead}>
            <Text style={styles.dashboardtext}>Welcome, Back</Text>
        <View style={styles.card}>
            <Text style={styles.cardtitle}>History</Text>
            <Pressable style={styles.viewbtn} onPress={redircttohistory}><Text style={styles.btntext}>View</Text></Pressable>
        </View>
        </View>
        <View style={styles.dashboardbottom}>
           
            <View style={styles.longcard}>
            <Pressable style={styles.con} onPress={redirct}>
                <Text style={styles.cardhead}>Text Verification</Text>
                <Ionicons name={"book"} color={"#f75e4e"} size={48}></Ionicons>
                </Pressable>
            </View>
            
            <Pressable style={styles.con}>
            <View style={styles.longcard}>
            <Pressable style={styles.con} onPress={redirecttoimage}>
                <Text style={styles.cardhead}>Image Verification</Text>
                <Ionicons name={"image"} color={"#f75e4e"} size={48}></Ionicons>

                </Pressable>
            </View>
            </Pressable>
            
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 15,
  },
  dashboardhead: {
    marginTop: 100,
  },
  dashboardtext: {
    color: "#fff",
    fontSize: 32,
    width: 150,
  },
  card: {
    marginTop: 20,
    display: "flex",
    flexDirection:"column",
    backgroundColor: "#292929",
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  cardtitle: {
    color: "#fff",
    fontSize: 24,
    width: "80%",
    padding: 12,
    fontWeight:"800",


  },
  viewbtn: {
    backgroundColor: "#f75e4e",
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 40,
    
  },
  btntext: {
    color: "#fff",
    fontSize: 16,
    textAlign:"center",
    fontWeight: "900",
  },
  dashboardbottom: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 50,

  },
  longcard: {
    backgroundColor: "#292929",
    width: "50%",
    height: 220,
    padding: 20,
  },
  cardhead: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },
  con: {
    width:"100%",
  }

});