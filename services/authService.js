import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_BASE_URL = 'https://your-api.com'; 

// Fonction pour se connecter et obtenir le token
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/`, {
      email,
      password,
    });

    const { access, refresh } = response.data;

    // Stocker les tokens
    await SecureStore.setItemAsync('accessToken', access);
    await SecureStore.setItemAsync('refreshToken', refresh);

    console.log('Connexion réussie.');
  } catch (error) {
    console.error('Erreur de connexion :', error.response?.data || error.message);
  }
};

// Fonction pour faire une requête authentifiée
export const fetchProtectedData = async () => {
  const token = await SecureStore.getItemAsync('accessToken');

  if (!token) {
    console.error('Token non trouvé. Connectez-vous d\'abord.');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/protected-endpoint/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Données protégées :', response.data);
  } catch (error) {
    console.error('Erreur :', error.response?.data || error.message);
  }
};
