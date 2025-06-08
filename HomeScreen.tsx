import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [contacts, setContacts] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});

  const CONTACTS_KEY = 'circle-contacts';

  // 🚀 Load contacts + lastMessages on app start
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem(CONTACTS_KEY);
        if (storedContacts) {
          const contactList = JSON.parse(storedContacts);
          setContacts(contactList);

          // Load lastMessages for each contact
          const previews: Record<string, string> = {};
          for (const contact of contactList) {
            const stored = await AsyncStorage.getItem(`chat-${contact}`);
            if (stored) {
              const messages = JSON.parse(stored);
              if (messages.length > 0) {
                previews[contact] = messages[messages.length - 1].text;
              }
            }
          }
          setLastMessages(previews);
        }
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };

    loadContacts();
  }, []);

  // 🚀 Save contacts anytime they change
  const saveContacts = async (updatedContacts: string[]) => {
    try {
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));
    } catch (error) {
      console.error('Failed to save contacts:', error);
    }
  };

  const addContact = () => {
    if (contacts.length >= 10) {
      Alert.alert('Limit Reached', 'You can only have 10 contacts.');
      return;
    }

    if (nameInput.trim() === '') {
      Alert.alert('No Name', 'Please enter a name.');
      return;
    }

    const newContacts = [...contacts, nameInput.trim()];
    setContacts(newContacts);
    saveContacts(newContacts);

    setLastMessages({ ...lastMessages, [nameInput.trim()]: '' });
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
            onPress={async () => {
              try {
                const stored = await AsyncStorage.getItem(`chat-${item}`);
                let lastMessage = '';

                if (stored) {
                  const messages = JSON.parse(stored);
                  if (messages.length > 0) {
                    lastMessage = messages[messages.length - 1].text;
                  }
                }

                setLastMessages((prev) => ({ ...prev, [item]: lastMessage }));

                navigation.navigate('Chat', { contactName: item });
              } catch (error) {
                console.error('Error loading chat:', error);
                navigation.navigate('Chat', { contactName: item });
              }
            }}
            onLongPress={() => {
              Alert.alert(
                'Remove Contact',
                `Are you sure you want to remove ${item}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                      const newContacts = contacts.filter((c) => c !== item);
                      setContacts(newContacts);
                      saveContacts(newContacts);

                      const newLastMessages = { ...lastMessages };
                      delete newLastMessages[item];
                      setLastMessages(newLastMessages);
                    },
                  },
                ]
              );
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.contact}>{item}</Text>
              {lastMessages[item] ? (
                <Text style={{ color: '#555', fontSize: 14 }}>
                  {lastMessages[item]}
                </Text>
              ) : null}
            </View>
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
    marginBottom: 5,
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
