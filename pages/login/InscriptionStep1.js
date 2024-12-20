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
        const responseGenres = await fetch('http://192.168.1.199:8000/api/genres');
        if (!responseGenres.ok) throw new Error(`Erreur HTTP: ${responseGenres.status}`);
        const dataGenres = await responseGenres.json();
        setGenres(dataGenres);
        setLoadingGenres(false);
      } catch (error) {
        console.error('Erreur de récupération des genres:', error);
      }

      try {
        const responseSituations = await fetch('http://192.168.1.199:8000/api/situations-matrimoniales/');
        if (!responseSituations.ok) throw new Error(`Erreur HTTP: ${responseSituations.status}`);
        const dataSituations = await responseSituations.json();
        setSituationsMatrimoniales(dataSituations);
        setLoadingSituations(false);
      } catch (error) {
        console.error('Erreur de récupération des situations matrimoniales:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };


  const handleSubmit = () => {
    // Validation des champs requis sauf le prénom
    if (!formData.nom || !formData.genre || !formData.dateNaissance || !formData.lieuNaissance || !formData.situationMatrimoniale) {
      alert('Tous les champs sauf le prénom sont obligatoires.');
    } else {
      // Passer les données à la page suivante
      navigation.push('InscriptionStep2', { step1Data: formData  });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo et sous-titre */}
        <Image
          source={require('../../assets/Logo-DGI.jpg')}
          style={styles.logo}
        />
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
                  formData.genre === genre.genre && styles.checkBoxSelected,
                ]}
                onPress={() => handleInputChange('genre', genre.genre)}
              >
                <Text style={styles.checkBoxText}>{genre.genre}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Date de naissance (JJ/MM/AAAA)"
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
                  value={situation.situation}
                />
              ))}
            </Picker>
          )}
        </View>

        {/* Bouton suivant */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
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
