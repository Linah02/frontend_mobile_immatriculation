import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const InscriptionStep3 = ({ navigation, route }) => {
  // Récupérer les données des étapes 1 et 2
  const { step1Data, id_fokontany } = route.params ? route.params : {};
  if (!step1Data || !id_fokontany) {
    Alert.alert('Erreur', 'Données manquantes dans les étapes précédentes.');
    navigation.goBack();
    return; // Ne pas continuer l'exécution
  }

  const [cinData, setCinData] = useState({
    cin: '',
    dateDelivrance: '',
    lieuDelivrance: '',
    contact: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setCinData({ ...cinData, [field]: value });
    console.log(`Changement dans ${field}:`, value);  // Affiche la donnée chaque fois qu'un champ est modifié
  };
  const handleSubmit = async () => {
    const { cin, dateDelivrance, lieuDelivrance, contact, email } = cinData;
    console.log("Données du formulaire avant soumission:",step1Data,id_fokontany, cinData,);
    
    // Validation des champs côté client
    if (!cin || !dateDelivrance || !lieuDelivrance || !contact || !email) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
  
    if (!/^\d{12}$/.test(cin)) {
      Alert.alert('Erreur', 'Le N° CIN doit contenir exactement 12 chiffres.');
      return;
    }
  
    if (!/\d{4}-\d{2}-\d{2}/.test(dateDelivrance)) {
      Alert.alert('Erreur', 'La date de délivrance doit être au format AAAA-MM-JJ.');
      return;
    }
  
    if (!/^\d{10}$/.test(contact)) {
      Alert.alert('Erreur', 'Le contact doit contenir exactement 10 chiffres.');
      return;
    }
  
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.199:8000/api/inscription/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cinData,
          step1Data,
          id_fokontany,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Inscription réussie.');
      } else {
        // Afficher le message d'erreur retourné par le serveur
        Alert.alert('Erreur', result.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur. Veuillez réessayer.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informations CIN et Contact</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>N° CIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le N° CIN"
          value={cinData.cin}
          onChangeText={(value) => handleInputChange('cin', value)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date de Délivrance</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer la date de délivrance (AAAA-MM-JJ)"
          value={cinData.dateDelivrance}
          onChangeText={(value) => handleInputChange('dateDelivrance', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lieu de Délivrance</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le lieu de délivrance"
          value={cinData.lieuDelivrance}
          onChangeText={(value) => handleInputChange('lieuDelivrance', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le contact (10 chiffres)"
          value={cinData.contact}
          onChangeText={(value) => handleInputChange('contact', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer l'email"
          value={cinData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
        />
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()} // Revenir à l'étape précédente
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit} // Soumettre les données
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InscriptionStep3;
