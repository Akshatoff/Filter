import React, { useEffect, useState, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

interface HistoryItem {
  id: string;
  verifiedText: string;
  verificationResponse: string;
  timestamp: number;
}

const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@search_history');
      if (jsonValue != null) {
        setHistory(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyItem}>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      <Text style={styles.verifiedText} numberOfLines={2}>{item.verifiedText}</Text>
      <Text style={styles.verificationResponse} numberOfLines={3}>{item.verificationResponse}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.historyhead}>History </Text>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No search history yet</Text>
        }
      />
      <View style={styles.footer}>
        <Ionicons name='add-circle-sharp' color={"#f75e4e"} size={64}></Ionicons>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  historyItem: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#f75e4e"
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  verificationResponse: {
    fontSize: 14,
    color: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  historyhead: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 50,
    textAlign:"center",
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

export default HistoryScreen;