import { StyleSheet, Button, View, Alert, Text } from 'react-native';
import React, { useState } from "react";
import { TextInput } from "react-native";

const API_KEY = "AIzaSyCLaTYaTrwNO1xNK7WqSdfOpDMD2XlgyYI"; 
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (input: string) => {
    setText(input);
  }

  const handleSubmit = async () => {
    if (!API_KEY) {
      Alert.alert("Error", "API key is not set. Please check your environment variables.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt: {
            text: `Is this information valid? If yes, then from which source is it from: "${text}"`,
          },
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        })
      });

      if (!response.ok) {
        const errorText = await response.text(); // Add this to get more error details
        console.error(`HTTP error! status: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        const geminiResponse = data.candidates[0].content.parts[0].text;
        Alert.alert("Gemini Response", geminiResponse);
      } else {
        throw new Error("Unexpected response structure from API");
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        Alert.alert("Error", `An error occurred: ${error.message}`);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.body}>
      <TextInput
        style={styles.textbox}
        onChangeText={handleInputChange}
        value={text}
        placeholder="Enter text to verify"
        placeholderTextColor="#999"
      />
      <Button
        title={isLoading ? "Loading..." : "Submit"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textbox: {
    padding: 10,
    fontSize: 16,
    borderColor: "white",
    borderWidth: 2,
    width: "100%",
    marginBottom: 20,
    color: "white",
  },
});
