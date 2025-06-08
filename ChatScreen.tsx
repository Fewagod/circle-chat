import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ChatScreenProps = {
  route: any;
};

export default function ChatScreen({ route }: ChatScreenProps) {
  const { contactName } = route.params;
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const STORAGE_KEY = `chat-${contactName}`;

  // Load messages when screen opens
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [STORAGE_KEY]);

  // Save messages when a new message is sent
  const saveMessages = async (newMessages: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, input.trim()];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {contactName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
  },
});
