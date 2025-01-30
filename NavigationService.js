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

// Fonction pour obtenir le nom de la route actuelle
export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name || '';
  }
  return '';
}