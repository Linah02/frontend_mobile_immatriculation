import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Bienvenue() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans mon application!</Text>
      <Text style={styles.subtitle}>Voici une page d ''accueil séparée de App.js.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 20,
    color: '#888',
  },
});
