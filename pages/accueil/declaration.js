import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';

const Declaration = () => {
  const route = useRoute();
  const [montantBase, setMontantBase] = useState('');
  const [typeDroit, setTypeDroit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [montantCalcule, setMontantCalcule] = useState(null);

  const handleCalculEtConfirmation = async () => {
    if (!montantBase || !typeDroit) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (parseFloat(montantBase) < 10000) {
      Alert.alert('Erreur', 'Le montant doit être supérieur ou égal à 10 000 Ar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('https://api-mobile-immatriculation.onrender.com/api/declaration_DE/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          montant_base: montantBase,
          type_droit: typeDroit,
          confirm: false,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setMontantCalcule(data.montant_calcule);
        Alert.alert(
          'Montant Calculé',
          `${data.message}\nVoulez-vous enregistrer cette déclaration ?`,
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Confirmer', onPress: () => enregistrerDeclaration() },
          ]
        );
      } else {
        Alert.alert('Erreur', data.error || 'Erreur lors du calcul');
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Alert.alert('Erreur', 'Impossible de joindre le serveur');
    }
  };

  const enregistrerDeclaration = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch('https://api-mobile-immatriculation.onrender.com/api/declaration_DE/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          montant_base: montantBase,
          type_droit: typeDroit,
          confirm: true,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        Alert.alert('Succès', data.message);
        setMontantBase('');
        setTypeDroit('');
        setMontantCalcule(null);
      } else {
        Alert.alert('Erreur', data.error || 'Erreur lors de l’enregistrement');
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Alert.alert('Erreur', 'Échec de la connexion au serveur');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Déclaration DE</Text>

      <Text style={styles.label}>Montant de la Base Imposable (Ar)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={montantBase}
        onChangeText={setMontantBase}
        placeholder="Entrez le montant de base"
      />

      <Text style={styles.label}>Type de Droit d'Enregistrement</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={typeDroit}
          onValueChange={(itemValue) => setTypeDroit(itemValue)}
        >
          <Picker.Item label="Sélectionnez un type de droit" value="" />
          <Picker.Item label="Vente d'immeuble" value="1" />
          <Picker.Item label="Donation" value="2" />
          <Picker.Item label="Succession" value="3" />
        </Picker>
      </View>

      {montantCalcule && (
        <Text style={styles.resultText}>Montant calculé : {montantCalcule} Ar</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCalculEtConfirmation}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Calculer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a9d8de',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultText: {
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#444',
    fontSize: 16,
  },
});

export default Declaration;
