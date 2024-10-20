import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Button, View, Alert, Text, FlatList, Linking, KeyboardAvoidingView, Platform, TextInput, ScrollView, Image, Pressable } from 'react-native';
import OpenAI from "openai";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const textInputRef = useRef<TextInput>(null);
  const [image, setImage] = useState<string | null>(null);
  const [aiDetectionResult, setAiDetectionResult] = useState<string>("");



  useEffect(() => {
    loadStoredText();
  }, []);

  const loadStoredText = async () => {
    try {
      const storedText = await AsyncStorage.getItem('@verification_text');
      if (storedText !== null) {
        setText(storedText);
      }
    } catch (error) {
      console.error('Error loading stored text:', error);
    }
  };

  const saveText = async (textToSave: string) => {
    try {
      await AsyncStorage.setItem('@verification_text', textToSave);
    } catch (error) {
      console.error('Error saving text:', error);
    }
  };

  const handleInputChange = (input: string) => {
    setText(input);
    saveText(input);
  }

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

  

  const fetchNews = async (query: string) => {
    const params: any = {
      api_token: "V5jTTfcrQs9CAFIjeLS9ZotFJ1NA0bdBsUAbCASJ",
      search: query,
      limit: "5"
    };

    const esc = encodeURIComponent;
    const queryString = Object.keys(params)
      .map(k => `${esc(k)}=${esc(params[k])}`)
      .join('&');

    try {
      const response = await fetch(`https://api.thenewsapi.com/v1/news/all?${queryString}`);
      const result = await response.json();
      setArticles(result.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert("Error", "Failed to fetch news articles.");
    }
  }

  

  const verifyText = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: text }
        ],
      });
      const newResponse = completion.choices[0].message.content || "No response";
      setResponse(newResponse);
      fetchNews(text);
      
      // Save the new search to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        verifiedText: text,
        verificationResponse: newResponse,
        timestamp: Date.now(),
      };
  
      try {
        const jsonValue = await AsyncStorage.getItem('@search_history');
        let history: HistoryItem[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        history.unshift(newHistoryItem); // Add new item to the beginning of the array
        
        // Limit history to last 50 items
        if (history.length > 50) {
          history = history.slice(0, 50);
        }
        
        await AsyncStorage.setItem('@search_history', JSON.stringify(history));
      } catch (error) {
        console.error('Error saving to history:', error);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to get a response from the AI.");
    }
  };



  const renderArticle = ({ item }: { item: Article }) => (
    <View style={styles.articleContainer}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleSnippet}>{item.snippet}</Text>
      <Text style={styles.articleLink} onPress={() => Linking.openURL(item.url)}>
        Read more
      </Text>
    </View>
  );

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
        <View style={styles.inputContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.textbox}
            onChangeText={handleInputChange}
            value={text}
            placeholder="Enter text to verify"
            placeholderTextColor="#999"
          />
          <Pressable style={styles.verify} onPress={verifyText}>
          <Text style={styles.verifytext}>Verify Text</Text>

          </Pressable>
          </View>
        
        {response && (
          <Text style={styles.responseText}>Verdict: {response}</Text>
        )}
        
        {articles.length > 0 && (
          <View style={styles.articlesContainer}>
            <Text style={styles.articlesHeader}>Related News Articles:</Text>
            <FlatList
              data={articles}
              renderItem={renderArticle}
              keyExtractor={(item: Article) => item.uuid}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 50,
    
  },
  textbox: {
    padding: 10,
    fontSize: 16,
    borderColor: "#f75e4e",
    borderWidth: 2,
    marginBottom: 10,
    color: "white",
    width: "90%",
    backgroundColor: "#292929",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 30,
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    color: "white",
  },
  articlesContainer: {
    marginTop: 20,
  },
  articlesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  articleContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  articleSnippet: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  articleLink: {
    fontSize: 14,
    color: '#4a90e2',
    textDecorationLine: 'underline',
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
  }
});