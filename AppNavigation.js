import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import InscriptionStep1 from './pages/login/InscriptionStep1'; // Assurez-vous du chemin correct
import InscriptionStep2 from './pages/login/InscriptionStep2'; // Assurez-vous du chemin correct
import InscriptionStep3 from './pages/login/InscriptionStep3'; // Nouvelle étape

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InscriptionStep1">
        <Stack.Screen
          name="InscriptionStep1"
          component={InscriptionStep1}
          options={{ title: 'Étape 1 - Informations personnelles' }}
        />
        <Stack.Screen
          name="InscriptionStep2"
          component={InscriptionStep2}
          options={{ title: 'Étape 2 - Résidence' }}
        />
        <Stack.Screen
          name="InscriptionStep3"
          component={InscriptionStep3}
          options={{ title: 'Étape 3 - CIN et Contact' }} // Titre de la nouvelle étape
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
