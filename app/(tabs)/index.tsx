import React, { useState, useRef } from "react";
import { StyleSheet, Button, View, Alert, Text, FlatList, Linking, KeyboardAvoidingView, Platform, TextInput, ScrollView } from 'react-native';
import OpenAI from "openai";

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

export default function HomeScreen() {
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const textInputRef = useRef<TextInput>(null);

  const handleInputChange = (input: string) => {
    setText(input);
  }

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
      setResponse(completion.choices[0].message.content || "No response");
      fetchNews(text);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to get a response from the AI.");
    }
  }

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
          <Button title='Verify' onPress={verifyText} />
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
  },
  textbox: {
    padding: 10,
    fontSize: 16,
    borderColor: "white",
    borderWidth: 2,
    width: "100%",
    marginBottom: 10,
    color: "white",
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
});