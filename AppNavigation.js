import React from 'react';
import { View, TouchableOpacity, Animated, Text, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InscriptionStep1 from './pages/login/InscriptionStep1';
import InscriptionStep2 from './pages/login/InscriptionStep2';
import InscriptionStep3 from './pages/login/InscriptionStep3';
import Connexion_part1 from './pages/login/connexion_part1';
import ProfileScreen from './pages/login/profil';
import RecuperationCode from './pages/login/connexion_part2';
import Acceuil from './pages/accueil/index';
import StatistiqueScreen from './pages/accueil/chart';
import TransactionList from './pages/accueil/TransactionList';
import TransactionDetail from './pages/accueil/detailTransaction';
import { navigationRef } from './NavigationService';
import ChatScreen from './pages/discussion/message';
const Stack = createStackNavigator();
const logout = async () => {
  try {
    // Supprimer les informations d'authentification stockées
    // await AsyncStorage.removeItem('userToken');  // ou votre clé de session

    // Rediriger vers la page de connexion
    navigationRef.navigate('Login');
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
// const Tab = createBottomTabNavigator(); // Créer le TabNavigator pour la barre de navigation en bas
const AppNavigation = ({ toggleMenu, slideAnim }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName={"Login"}>
        {/* <Stack.Navigator initialRouteName="Login"> */}
          <Stack.Screen name="InscriptionStep1" component={InscriptionStep1} options={{ title: 'Inscription Step 1' }} />
          <Stack.Screen name="InscriptionStep2" component={InscriptionStep2} options={{ title: 'Inscription Step 2' }} />
          <Stack.Screen name="InscriptionStep3" component={InscriptionStep3} options={{ title: 'Inscription Step 3' }}/>
          <Stack.Screen
  name="Login"
  component={Connexion_part1}
  options={{ headerShown: false, tabBarVisible: false }} // Cache également la barre de navigation en bas si nécessaire
/>

          <Stack.Screen name="Acceuil" component={Acceuil} />
          <Stack.Screen name="RecuperationCode" component={RecuperationCode}  options={{ headerShown: false, tabBarVisible: false }}/>
          <Stack.Screen name="TransactionList" component={TransactionList} options={{ title: 'Historique des paiements' }} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetail} options={{ title: 'transaction' }} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Mon Profil' }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Discussion' }} />
          <Stack.Screen name="StatistiqueScreen" component={StatistiqueScreen} options={{ title: 'Charts' }} />
        </Stack.Navigator>

        {/* Menu glissant */}
        <Animated.View
          style={[
            styles.menu,
            {
              transform: [{ translateX: slideAnim }],
              marginTop: StatusBar.currentHeight || 0, // Décalage du menu glissant sous la barre de statut
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigationRef.navigate('TransactionList');
            }}
          >
            <Ionicons name="list" size={25} color="white" />
            <Text style={styles.menuText}>Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            toggleMenu();
            navigationRef.navigate('StatistiqueScreen'); // Navigation vers le Profil
          }}
          >
            <Ionicons name="bar-chart" size={25} color="white" />
            <Text style={styles.menuText}>Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigationRef.navigate('ProfileScreen'); // Navigation vers le Profil
            }}
          >
            <Ionicons name="person-circle" size={25} color="white" />
            <Text style={styles.menuText}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}
          onPress={logout}>
            <Ionicons name="exit" size={25} color="white" />
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200, // Largeur fixe pour le menu
    backgroundColor: 'gray',
    borderRightWidth: 1,
    borderRightColor: '#a9d8de',
    paddingTop: 60,
    paddingLeft: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
});

export default AppNavigation;