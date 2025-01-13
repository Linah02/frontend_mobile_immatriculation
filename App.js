import React, { useState } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Animated, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigation from './AppNavigation'; // Importez votre AppNavigation
import { navigationRef } from './NavigationService'; // Assurez-vous que navigationRef est bien importé

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250)); // Valeur initiale pour l'animation du menu

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
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200, // Largeur fixe pour le menu
    backgroundColor: 'gray',
    borderRightWidth: 1,
    borderRightColor: '#a9d8de',
    paddingTop: 60,
    paddingLeft: 20,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
