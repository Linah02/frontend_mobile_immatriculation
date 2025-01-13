import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false); // Modal pour options
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // Modal pour le changement de mot de passe
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // Position du modal
  const [userData, setUserData] = useState({
    name: "Nom d'utilisateur",
    contact: "Non spécifié",
    email: "Non spécifié",
    photo: null,
    cin: "N/A",
    propr_nif: "N/A",
  });

  // State pour le mot de passe
  const [oldPassword, setOldPassword] = useState(""); // Ancien mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fonction pour récupérer les données de l'API
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://192.168.1.199:8000/api/api_profil', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setUserData({
          name: data.name || "Nom d'utilisateur",
          contact: data.contact || "Non spécifié",
          email: data.email || "Non spécifié",
          photo: data.photo || null,
          cin: data.cin || "N/A",
          propr_nif: data.propr_nif || "N/A",
        });
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Charger les données de l'utilisateur lors du premier rendu
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fonction pour récupérer la position du bouton
  const handleLayout = (event) => {
    const { x, y, height } = event.nativeEvent.layout; // Position x, y, et hauteur
    setModalPosition({ top: y + height, left: x }); // Ajuster la position du modal en dessous du bouton
  };

  const formatNumberWithSpaces = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  // Fermer le modal
  const closeModal = () => setModalVisible(false);

  const closePasswordModal = () => setPasswordModalVisible(false);

 // Fonction pour modifier le mot de passe
const handleChangePassword = async () => {
  // Vérifier si les mots de passe correspondent
  if (newPassword !== confirmPassword) {
    setPasswordError("Les mots de passe ne correspondent pas.");
    return;
  }

  // Affichage des données du formulaire dans la console
  console.log("Ancien mot de passe:", oldPassword);
  console.log("Nouveau mot de passe:", newPassword);
  console.log("Confirmer le mot de passe:", confirmPassword);

  try {
    const response = await fetch('http://192.168.1.199:8000/api/modifier_mot_de_passe_api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Spécifier le type de contenu
      },
      body: JSON.stringify({
        old_password: oldPassword,  // Ancien mot de passe
        new_password: newPassword,  // Nouveau mot de passe
        confirm_password: confirmPassword  // Confirmation du nouveau mot de passe
      }),
    });
    const data = await response.json();  // Attendre la réponse JSON

    if (response.ok) {
      alert("Mot de passe modifié avec succès!");
      closePasswordModal(); // Fermer le modal de mot de passe
    } else {
      alert(data.error || "Erreur lors de la modification du mot de passe.");
    }
  } catch (error) {
    console.error('Error changing password:', error);
    alert("Erreur de connexion au serveur.");
  }
};

  
  // Afficher les options de modification dans le modal
  const handleOptionSelect = (option) => {
    if (option === "Modifier Mot de Passe") {
      setPasswordModalVisible(true);
    }
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Première boîte */}
      <View style={styles.headerBox}>
        {/* Photo ou avatar par défaut */}
        <View style={styles.photoContainer}>
          {userData.photo ? (
            <Image
              source={{ uri: `http://192.168.1.199:8000/media/${userData.photo}` }}
              style={styles.profilePhoto}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="#fff" />
          )}
        </View>
        {/* Nom et détails */}
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userDetails}>Contact: {userData.contact}</Text>
          <Text style={styles.userDetails}>Email: {userData.email}</Text>
        </View>
        {/* Menu (pencil) */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setModalVisible(true)}
          onLayout={handleLayout} // Utiliser onLayout pour obtenir la position du bouton
        >
          <Ionicons name="pencil-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Détails */}
      <View style={styles.detailBox}>
        <Text style={styles.detailText}>N° CIN: {formatNumberWithSpaces(userData.cin)}</Text>
        <Text style={styles.detailText}>N° PRENIF: {formatNumberWithSpaces(userData.propr_nif)}</Text>
      </View>

      {/* Modal pour les options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, { top: modalPosition.top, right: modalPosition.right }]} >
                <TouchableOpacity style={styles.modalItem} onPress={() => handleOptionSelect('Modifier Info')}>
                  <Ionicons name="information-circle-outline" size={24} color="#f1c038" />
                  <Text style={styles.modalText}>informations</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={() => handleOptionSelect('Modifier Mot de Passe')}>
                  <Ionicons name="key-outline" size={24} color="red" />
                  <Text style={styles.modalText}>mot de passe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={() => handleOptionSelect('Modifier Photo')}>
                  <Ionicons name="camera-outline" size={24} color="green" />
                  <Text style={styles.modalText}>photo de profil</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal pour modifier le mot de passe */}
      <Modal
        transparent={true}
        visible={passwordModalVisible}
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <TouchableWithoutFeedback onPress={closePasswordModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.passwordModalContainer}>
                <Text style={styles.modalText}>Modifier Mot de Passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ancien mot de passe"
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nouveau mot de passe"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                <Button title="Valider" onPress={handleChangePassword} />
                <Button title="Annuler" onPress={closePasswordModal} color="red" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  headerBox: {
    width: '100%',
    backgroundColor: '#87CEEB', // Bleu ciel
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    position: 'relative',
    height: 200,
  },
  photoContainer: {
    marginRight: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    fontSize: 12,
    color: '#6d6d6d',
    marginTop: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  detailBox: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: 200,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    position: 'absolute',
  },
  passwordModalContainer: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ProfileScreen;
