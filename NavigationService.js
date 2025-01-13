import { createNavigationContainerRef } from '@react-navigation/native';

// Crée une référence de navigation
export const navigationRef = createNavigationContainerRef();

// Fonction pour naviguer
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// Fonction pour retourner en arrière
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
