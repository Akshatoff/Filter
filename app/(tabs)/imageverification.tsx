import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Button, View, Alert, Text, FlatList, Linking, KeyboardAvoidingView, Platform, TextInput, ScrollView, Image, Pressable } from 'react-native';
import OpenAI from "openai";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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
  
  const [image, setImage] = useState<string | null>(null);
  const [aiDetectionResult, setAiDetectionResult] = useState<string>("");




  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      detectAiImage(result.assets[0].uri);
    }
  };

  const detectAiImage = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('media', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('models', 'genai');
    formData.append('api_user', '154303857');
    formData.append('api_secret', 'VbN5SrRTPXUB8ccA37YhXE6XvgBJT9iq');

    try {
      const response = await axios.post<SightengineResponse>('https://api.sightengine.com/1.0/check.json', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.type.ai_generated > 0.5) {
        setAiDetectionResult("AI generated");
      } else {
        setAiDetectionResult("Not AI generated");
      }
    } catch (error) {
      console.error('Error detecting AI image:', error);
      Alert.alert("Error", "Failed to detect AI in the image.");
    }
  };



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
        <View style={styles.navbar}>
          <Text style={styles.navhead}>Filter</Text>
        </View>
       <View style={styles.imageverify}>
          <Pressable style={styles.btn} onPress={pickImage}>
            <Text style={styles.btntext}>Upload Image Here</Text>

          </Pressable>
          <Pressable style={styles.verify} onPress={detectAiImage as never}>
            <Text style={styles.verifytext}>Verify Image</Text>
          </Pressable>
          </View>
          {image && (
            <View>
              <Image source={{uri: image}} style={styles.image} />
              <Text style={styles.aiDetectionResult}>{aiDetectionResult}</Text>
            </View>
          )}
          
          <View style={styles.footer}>
        <Ionicons name='add-circle-sharp' color={"#f75e4e"} size={64}></Ionicons>
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
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  aiDetectionResult: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  imageverify: {
    marginTop: 50,

  },
  btn: {
    width: "90%",
    backgroundColor: "#292929",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 30,
  },
  btntext: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  verify: {
    backgroundColor: "#f75e4e",
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 40,
    width: 200,
    marginTop: 50,
  },
  verifytext: {
    fontWeight: "900",
    color: "#fff"
  },
  navbar: {
    marginTop: 50,
  }, 
  navhead: {
    textAlign: "center",
    fontWeight:"800",
    color: "#fff",
    fontSize: 32,
  },
  footer: {
    display: "flex",
    alignItems:"center",
    marginTop: 300,
  }
});