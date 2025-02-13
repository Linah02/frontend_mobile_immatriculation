import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecuperationCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);  
  const [isCodeValid, setIsCodeValid] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    let interval = null;

    if (timer > 0 && isCodeValid) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setError('Le code a expiré, veuillez en demander un nouveau.');
      setIsCodeValid(false); 
    }

    return () => clearInterval(interval);
  }, [timer, isCodeValid]);

  const handleSendCode = async () => {
    try {
      // Appeler l'API pour envoyer le code
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/send_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setIsCodeValid(true);
        setTimer(60); 
        setError(''); 
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code.');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur réseau');
    }
  };

  const handleValidateCode = async () => {
    if (code.length === 6 && !isNaN(code)) {
      try {
        const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/validate_code/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          navigation.navigate('ProfileScreen');
        } else {
          setError(data.error || 'Code incorrect');
        }
      } catch (error) {
        console.error(error);
        setError('Erreur réseau');
      }
    } else {
      setError('Veuillez entrer un code à 6 chiffres valides.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Cliquez sur le bouton "Renvoyer" pour obtenir un code de validation. Ce code est composé de 6 chiffres.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Entrez le code ici"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6} // Limite à 6 chiffres
      />

      <Text style={styles.timer}>
        {isCodeValid ? `Code valide pour ${timer}s` : 'Code expiré, veuillez renvoyer un code.'}
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.redButton]}
          onPress={handleSendCode}
          disabled={isCodeValid && timer > 0} 
        >
          <Text style={styles.buttonText}>Renvoyer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={handleValidateCode}
          disabled={!isCodeValid || timer === 0} 
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  timer: {
    fontSize: 14,
    marginBottom: 20,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#f44336',
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default RecuperationCode;
