import { StyleSheet, Button, View, Alert, Text } from 'react-native';
import React, { useState } from "react";
import { TextInput } from "react-native";

const API_KEY = "";


export default function HomeScreen() {
  const [text, setText] = useState("");
 

  const handleInputChange = (input: string) => {
    setText(input);
  }

  const handleVerify = async () => {
    try {
      const response = await fetch(`https://idir.uta.edu/claimbuster/api/v2/score/text/${text}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
        }
    });
    console.log(JSON.stringify(response.json(), null, 2));
    } catch (error) {
      console.error(error);
      
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
     <Button title='verify' onPress={handleVerify}></Button>
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
