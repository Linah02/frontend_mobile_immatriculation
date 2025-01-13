import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour, comment puis-je vous aider ?', sender: 'repondeur', timestamp: '10:30 AM' },
    { id: '2', text: 'J\'ai une question concernant mon compte.', sender: 'moi', timestamp: '10:31 AM' }
  ]);

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: message,
        sender: 'moi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'moi' ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {/* Zone de saisie et icônes */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Écrivez un message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  sentMessage: {
    backgroundColor: '#87CEEB', // Bleu ciel pour "moi"
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedMessage: {
    backgroundColor: '#e0e0e0', // Gris clair pour le répondeur
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 10,
    fontSize: 16,
  },
  attachmentButton: {
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default ChatScreen;
