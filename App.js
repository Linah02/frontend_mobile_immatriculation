import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Animated, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigation from './AppNavigation'; // Importez votre AppNavigation
import { navigationRef } from './NavigationService'; // Assurez-vous que navigationRef est bien importé

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);  // Ajoutez un état pour le nombre de messages non lus
  const [slideAnim] = useState(new Animated.Value(-250)); // Valeur initiale pour l'animation du menu

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch('http://192.168.1.199:8000/api/unread_count/', { // Mettez ici l'URL correcte
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      
      if (data.unread_count !== undefined) {
        console.log("Messages non lus :", data.unread_count); // Afficher dans la console du navigateur
        setUnreadCount(data.unread_count); // Mettre à jour l'état avec le nombre de messages non lus
      } else {
        console.error('Erreur lors de la récupération des messages non lus:', data.error);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const response = await fetch('http://192.168.1.199:8000/api/mark_messages_as_read/', { // Mettez ici l'URL correcte
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Messages marqués comme lus");
        setUnreadCount(0); // Mettre à jour l'état pour supprimer l'indicateur
      } else {
        console.error('Erreur lors de la mise à jour des messages:', data.error);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
  
  // Appeler la fonction au démarrage
  useEffect(() => {
    fetchUnreadMessages(); // Récupérer les messages non lus au chargement
  }, []);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -200 : 0; // Valeur du menu (fermé ou ouvert)
    setIsMenuOpen(!isMenuOpen);
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const navigateToProfile = () => {
    navigationRef.current?.navigate('ProfileScreen'); // Utilisation de navigationRef pour la navigation
  };

  const navigateToChat = () => {
    markMessagesAsRead();
    navigationRef.current?.navigate('ChatScreen');
  };

  return (
    <View style={styles.container}>
      {/* Fond sombre quand le menu est ouvert */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <View style={styles.container}>
        <AppNavigation toggleMenu={toggleMenu} slideAnim={slideAnim} />
      </View>

      {/* Barre de navigation en bas */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#a9d8de" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={navigateToProfile} // Naviguer vers ProfileScreen
        >
          <Ionicons name="person" size={30} color="#a9d8de" />
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.navButton}
        onPress={navigateToChat}>
        <Ionicons name="chatbubbles" size={30} color="#a9d8de" />
        {/* Affichage du point rouge si unreadCount est supérieur à 0 */}
        {unreadCount > 0 && (
          <View style={styles.unreadIndicator} />
        )}
      </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Donne de l'espace pour la barre de navigation
  },
  navBar: {
    position: 'fixed',  // Change de 'absolute' à 'fixed'
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopWidth: 3,
    borderTopColor: '#a9d8de',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Style pour le point rouge
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
