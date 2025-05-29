import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

type ChatScreenProps = {
  route: any;
};

export default function ChatScreen({ route }: ChatScreenProps) {
  const { contactName } = route.params;
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages([...messages, input.trim()]);
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
