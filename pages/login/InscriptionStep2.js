import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import debounce from 'lodash.debounce';

const { height: screenHeight } = Dimensions.get('window');

const InscriptionStep2 = ({ navigation, route }) => {
  const [residenceData, setResidenceData] = useState({
    province: '',
    region: '',
    district: '',
    commune: '',
    fokontany: '',
    id_fokontany: '',
  });
  const { step1Data } = route.params;
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const inputRef = useRef(null); 

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length === 0) {
        setSuggestions([]);
        setDropdownVisible(false);
        return;
      }

      try {
        const response = await fetch(`http://192.168.0.185:8000/api/list_fokontany/?search=${query}`);
        if (!response.ok) throw new Error('Échec de la requête');

        const data = await response.json();
        setSuggestions(data);
        setDropdownVisible(data.length > 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error.message);
      }
    }, 500),
    []
  );

  const handleSuggestionSelect = (item) => {
    setResidenceData({
      ...residenceData,
      province: item.city_name,
      region: item.parish_name || '',
      district: item.locality_desc || '',
      commune: item.wereda_desc || '',
      fokontany: item.fkt_desc || '',
      id_fokontany: item.fkt_no || '',
    });
    setSuggestions([]);
    setDropdownVisible(false);
  };

  const handleInputChange = (field, value) => {
    setResidenceData({
      ...residenceData,
      [field]: value,
    });

    if (field === 'province') {
      fetchSuggestions(value);
    }
  };

  const formFields = [
    { label: 'Province', value: residenceData.province, field: 'province' },
    { label: 'Région', value: residenceData.region, field: 'region', editable: false },
    { label: 'District', value: residenceData.district, field: 'district', editable: false },
    { label: 'Commune', value: residenceData.commune, field: 'commune', editable: false },
    { label: 'Fokontany', value: residenceData.fokontany, field: 'fokontany', editable: false },
  ];

  useEffect(() => {
    console.log('Suggestions:', suggestions);
  }, [suggestions]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.field}
        ListHeaderComponent={<Text style={styles.subtitle}>Informations de Résidence</Text>}
        renderItem={({ item }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Entrer une ${item.label.toLowerCase()}`}
              value={item.value}
              onChangeText={(value) => handleInputChange(item.field, value)}
              editable={item.editable !== false}
              ref={item.field === 'province' ? inputRef : null} 
            />
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Afficher les suggestions sous le champ Province */}
            {isDropdownVisible && residenceData.province && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((item) => (
                  <TouchableWithoutFeedback key={item.fkt_no} onPress={() => handleSuggestionSelect(item)}>
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>
                        {item.city_name} - {item.parish_name || ''} - {item.locality_desc || ''} - {item.fkt_desc || ''}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            )}
            {/* Boutons Suivant et Précédent */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('InscriptionStep3', {
                    step1Data: step1Data, 
                    id_fokontany: residenceData.id_fokontany, 
                  })
                }
              >
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, 
    backgroundColor: '#f5f5f5',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 15,
    left:5,

  },
  label: {
    fontSize: 12,
    color: '#333',
    left:10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,

  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    position: 'absolute',
    top: -300, // Juste sous le champ de saisie
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 'auto',
    maxHeight: 'none',
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#a9d8de',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default InscriptionStep2;
