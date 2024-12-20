import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'utiliser Expo Vector Icons
import { useNavigation } from '@react-navigation/native';

const Acceuil = () => {
  const navigation = useNavigation(); // Hook pour gérer la navigation

  return (
    <View style={styles.container}>
      {/* Barre de navigation */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="calculator-outline" size={20} color="black" />
            <Text style={styles.navText}>Simulateur</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="log-in-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('InscriptionStep1')} // Navigation vers la page d'inscription
          >
            <Ionicons name="person-add-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x200' }} // Utilisez une URL publique temporaire
          style={styles.image}
        />
        <Text style={styles.text}>Bienvenue sur la page d accueil !</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navLeft: {
    flexDirection: 'row',
  },
  navRight: {
    flexDirection: 'row',
    gap: 10, // Espace fixe entre les enfants (pour React Native >= 0.70)
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default Acceuil;
