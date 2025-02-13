import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InscriptionStep1 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    genre: '',
    dateNaissance: '',
    lieuNaissance: '',
    situationMatrimoniale: '',
  });
  const [genres, setGenres] = useState([]);
  const [situationsMatrimoniales, setSituationsMatrimoniales] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingSituations, setLoadingSituations] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseGenres = await fetch('https://api-mobile-immatriculation.onrender.com/api/genres');
        if (!responseGenres.ok) throw new Error(`Erreur HTTP: ${responseGenres.status}`);
        const dataGenres = await responseGenres.json();
        setGenres(dataGenres);
      } catch (error) {
        console.error('Erreur de récupération des genres:', error);
        Alert.alert('Erreur', 'Impossible de charger les genres.');
      } finally {
        setLoadingGenres(false);
      }

      try {
        const responseSituations = await fetch(
          'https://api-mobile-immatriculation.onrender.com/api/situations-matrimoniales/'
        );
        if (!responseSituations.ok) throw new Error(`Erreur HTTP: ${responseSituations.status}`);
        const dataSituations = await responseSituations.json();
        setSituationsMatrimoniales(dataSituations);
      } catch (error) {
        console.error('Erreur de récupération des situations matrimoniales:', error);
        Alert.alert('Erreur', 'Impossible de charger les situations matrimoniales.');
      } finally {
        setLoadingSituations(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const today = new Date();
    const birthDate = new Date(formData.dateNaissance);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    if (age < 18) {
      Alert.alert('Âge insuffisant', 'Vous devez avoir au moins 18 ans pour continuer.');
      return;
    }
    if (!formData.nom || !formData.genre || !formData.dateNaissance || !formData.lieuNaissance || !formData.situationMatrimoniale) {
      Alert.alert('Champs manquants', 'Tous les champs sauf le prénom sont obligatoires.');
    } else {
      console.log('Données soumises :', formData); 
      navigation.push('InscriptionStep2', { step1Data: formData });
    }
   
    
  };
 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo et sous-titre */}
        <Image source={require('../../assets/Logo-DGI.jpg')} style={styles.logo} />
        <Text style={styles.subtitle}>Info personnelle</Text>

        {/* Formulaire */}
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={formData.nom}
          onChangeText={(text) => handleInputChange('nom', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={formData.prenom}
          onChangeText={(text) => handleInputChange('prenom', text)}
        />
       <View style={styles.checkBoxContainer}>
  {loadingGenres ? (
    <Text>Chargement des genres...</Text>
  ) : (
    genres.map((genre) => (
      <TouchableOpacity
        key={genre.id}
        style={[
          styles.checkBox,
          formData.genre === genre.id && styles.checkBoxSelected, // Compare avec genre.id
        ]}
        onPress={() => handleInputChange('genre', genre.id)} // Passe genre.id
      >
        <Text style={styles.checkBoxText}>{genre.genre}</Text>
      </TouchableOpacity>
    ))
  )}
</View>

        <TextInput
          style={styles.input}
          placeholder="Entrer la date de délivrance (AAAA-MM-JJ)"
          value={formData.dateNaissance}
          onChangeText={(text) => handleInputChange('dateNaissance', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Lieu de naissance"
          value={formData.lieuNaissance}
          onChangeText={(text) => handleInputChange('lieuNaissance', text)}
        />
        <View style={styles.pickerContainer}>
          {loadingSituations ? (
            <Text>Chargement des situations matrimoniales...</Text>
          ) : (
            <Picker
              selectedValue={formData.situationMatrimoniale}
              onValueChange={(itemValue) => handleInputChange('situationMatrimoniale', itemValue)}
            >
              <Picker.Item label="Sélectionner une option" value="" />
              {situationsMatrimoniales.map((situation) => (
                <Picker.Item
                  key={situation.id}
                  label={situation.situation}
                  value={situation.id}
                />
              ))}
            </Picker>
          )}
        </View>

        {/* Bouton suivant */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  checkBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  checkBoxSelected: {
    backgroundColor: '#a9d8de',
  },
  checkBoxText: {
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#a9d8de',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default InscriptionStep1;