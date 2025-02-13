import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const [prenif, setPrenif] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenif,
          password,
        }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API:', data);

      if (response.ok) {
        console.log('Navigating to RecuperationCode');
        navigation.navigate('RecuperationCode'); 
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur réseau');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/Logo-DGI.jpg')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="PRENIF"
        value={prenif}
        onChangeText={setPrenif}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      {/* Lien vers l'inscription */}
      <TouchableOpacity style={styles.registerLink}
        onPress={() => navigation.navigate('InscriptionStep1')} 
         >
        <Text style={styles.registerText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    height: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#808080',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  registerText: {
    color: '#0066cc',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default Login;
