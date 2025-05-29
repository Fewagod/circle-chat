import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState('');

  const addContact = () => {
    if (contacts.length >= 10) {
      Alert.alert('Limit Reached', 'You can only have 10 contacts.');
      return;
    }

    if (nameInput.trim() === '') {
      Alert.alert('No Name', 'Please enter a name.');
      return;
    }

    setContacts([...contacts, nameInput.trim()]);
    setNameInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Circle</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { contactName: item })}
          >
            <Text style={styles.contact}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter a name"
        value={nameInput}
        onChangeText={setNameInput}
      />

      <Button title="Add Contact" onPress={addContact} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contact: {
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
});
