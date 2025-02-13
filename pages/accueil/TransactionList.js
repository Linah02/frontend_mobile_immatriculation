import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const TransactionList = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/transactions/?page=1');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des transactions');
      }
      const data = await response.json();
      if (data && data.results) {
        setTransactions(data.results);
      } else {
        setError('Aucune transaction trouvée');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur de chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate('TransactionDetail', { n_quit: item.n_quit })} 
          >
            <View>
              <Text style={styles.date}>N° Quit: {item.n_quit}</Text>
              <View style={styles.resteContainer}>
                <Text style={styles.nomImpôt}>Reste à payer: </Text>
                <Text style={styles.resteAPayer}>{`${(item.reste_ap|| 0).toLocaleString('fr-FR')} Ar`}</Text>
              </View>
            </View>
            <View style={styles.totalPayeeContainer}>
              <Text style={styles.montantTitle}>Total Payée:</Text>
              <Text style={styles.totalPayee}>{`${(item.total_payee|| 0).toLocaleString('fr-FR')} Ar`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  resteContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  nomImpôt: {
    fontSize: 14,
    color: '#666',
  },
  resteAPayer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c61618', 
  },
  totalPayeeContainer: {
    alignItems: 'flex-end',
  },
  montantTitle: {
    fontSize: 14,
    color: '#666', 
  },
  totalPayee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32970a', 
  },
});

export default TransactionList;