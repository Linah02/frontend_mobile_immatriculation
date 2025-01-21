import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fonction pour récupérer les messages depuis l'API
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://192.168.1.199:8000/api/discussion/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMessages(data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages :', error);
      setLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission de stockage',
            message:
              'Cette application a besoin d\'accéder à vos fichiers pour les pièces jointes.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      console.log('Fichier sélectionné :', file);
      setSelectedFile(file);
    } catch (err) {
      console.error('Erreur lors de la sélection du fichier :', err);
    }
  };

  const sendMessage = async () => {
    if (message.trim() || selectedFile) {
      console.log('Envoi du message...');
      
      // Ajouter le message localement avant de l'envoyer
      const newMessage = {
        contenu: message,
        fichier_joint: selectedFile ? selectedFile.assets[0] : null,
        type_message: 'contribuable', // ou 'operateur', selon votre cas
        date_envoi: new Date().toISOString(),
      };
  
      setMessages((prevMessages) => [newMessage, ...prevMessages]); // Ajouter le nouveau message en haut de la liste
  
      const formData = new FormData();
      formData.append('contenu', message);
    
      if (selectedFile) {
        const file = selectedFile.assets[0]; // Extraire le fichier du tableau `assets`
        console.log('Fichier sélectionné :', file);
    
        formData.append('fichier_joint', {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream', // Ajouter un type MIME par défaut si non défini
          name: file.name,
        });
        console.log('Fichier dans FormData:', formData);
      }
    
      try {
        console.log('Tentative d\'envoi du message avec formData:', formData);
        const response = await axios.post('http://192.168.1.199:8000/api/discussion/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Réponse:', response.data);
        if (response.status === 200) {
          // Le message a été envoyé, rien de plus à faire ici pour la mise à jour
        } else {
          console.log('Erreur réponse:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
      }
    
      setMessage('');
      setSelectedFile(null);
    } else {
      console.log('Aucun message ou fichier à envoyer');
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => (item.id ? item.id.toString() : String(Math.random()))}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.type_message === 'operateur' ? styles.receivedMessage : styles.sentMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.contenu ? item.contenu : 'Message vide'}</Text>

              {item.fichier_joint && (
                <TouchableOpacity
                  onPress={() => {
                    const baseUrl = 'http://192.168.1.199:8000/media/';
                    const fullUrl = item.fichier_joint.startsWith('/')
                      ? `${baseUrl}${item.fichier_joint.slice(1)}`
                      : `${baseUrl}${item.fichier_joint}`;

                    Linking.openURL(fullUrl).catch((err) =>
                      console.error('Impossible d’ouvrir le fichier joint :', err)
                    );
                  }}
                  style={styles.attachmentIconContainer}
                >
                  <Ionicons name="document-attach" size={24} color="#007BFF" />
                </TouchableOpacity>
              )}

              <Text style={styles.timestamp}>
                {item.date_envoi ? new Date(item.date_envoi).toLocaleString() : ''}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Écrivez un message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.attachmentButton} onPress={selectFile}>
          <Ionicons name="attach" size={24} color={selectedFile ? '#007BFF' : '#888'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Affichage de l'URI du fichier sélectionné */}
      {selectedFile && (
        <Text style={styles.fileUriText}>Fichier sélectionné : {selectedFile.uri}</Text>
      )}
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
    backgroundColor: '#c1f2c1', // Vert pastel pour le contribuable
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedMessage: {
    backgroundColor: '#d3d3d3', // Gris pastel pour l'opérateur
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
  attachmentIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fileUriText: {
    marginTop: 10,
    color: '#007BFF',
    fontSize: 12,
  },
});

export default ChatScreen;
