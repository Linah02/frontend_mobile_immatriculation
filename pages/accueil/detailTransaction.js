import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const TransactionDetail = () => {
  const route = useRoute();
  const { n_quit } = route.params; // Récupérer le n_quit
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionDetail = async () => {
    try {
      const response = await fetch(`https://api-mobile-immatriculation.onrender.com/api/api_transaction_details/${n_quit}/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de la transaction');
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error(error);
      setError('Erreur de chargement des détails de la transaction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionDetail();
  }, [n_quit]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
      Historique des transactions {n_quit || 'Non spécifié'}
      </Text>
      {transactions.length > 0 ? (
        <View style={styles.tableBox}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Montant (MGA)</Text>
          </View>
          {transactions.map((transaction, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{transaction.date_paiement || 'N/A'}</Text>
              <Text style={styles.tableCell}> {`${(transaction.montant || 0).toLocaleString('fr-FR')} Ar`}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.infoText}>Aucune transaction disponible</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#db5454',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8fc3c6',
  },
  tableBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});
export default TransactionDetail;