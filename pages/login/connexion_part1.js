// pages/Login/index.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import loginStyles from './styles/loginStyles'; // Import des styles
const Login = () => {
  return (
    <View style={loginStyles.container}>
      <Text>Connexion</Text>
      <TextInput style={loginStyles.input} placeholder="PRENIF" />
      <TextInput style={loginStyles.input} placeholder="Mot de passe" secureTextEntry />
      <Button title="Se connecter" onPress={() => {}} />
    </View>
  );
};


export default Login;