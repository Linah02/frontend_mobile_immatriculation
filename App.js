import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Animated, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigation from './AppNavigation'; 
import { navigationRef, getCurrentRouteName } from './NavigationService';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);  
  const [slideAnim] = useState(new Animated.Value(-250)); 
  const [currentRoute, setCurrentRoute] = useState('');

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/unread_count/', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      
      if (data.unread_count !== undefined) {
        console.log("Messages non lus :", data.unread_count);
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
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/mark_messages_as_read/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Messages marqués comme lus");
        setUnreadCount(0);
      } else {
        console.error('Erreur lors de la mise à jour des messages:', data.error);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
  const isLoginScreen = ['Login', 'RecuperationCode','InscriptionStep1','InscriptionStep2','InscriptionStep3'].includes(currentRoute);
 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoute(getCurrentRouteName());
    }, 500); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUnreadMessages(); 
  }, []);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -200 : 0; 
    setIsMenuOpen(!isMenuOpen);
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const navigateToProfile = () => {
    navigationRef.current?.navigate('ProfileScreen'); 
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
        <AppNavigation  ref={navigationRef} toggleMenu={toggleMenu} slideAnim={slideAnim} />
      </View>

      {/* Barre de navigation en bas */}
      {!isLoginScreen && (
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color="#a9d8de" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}
          onPress={() => navigationRef.current?.navigate('ProfileScreen')}>
            <Ionicons name="person" size={30} color="#a9d8de" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}
          onPress={() => navigationRef.current?.navigate('ChatScreen')}>
            <Ionicons name="chatbubbles" size={30} color="#a9d8de" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 70, 
  },
  navBar: {
    position: 'fixed', 
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
