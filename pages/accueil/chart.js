import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const StatistiqueScreen = () => {
  // Définition des données du graphique
  const data = {
    labels: ['01/01', '02/01', '03/01', '04/01', '05/01'],  // Dates sur l'axe X
    datasets: [
      {
        data: [1000, 1500, 1200, 1800, 2000],  // Montants sur l'axe Y
      },
    ],
  };

  // Taille du graphique
  const screenWidth = Dimensions.get('window').width;

  // Données pour le tableau
  const tableData = [
    { date: '01/01', montant: '1000' },
    { date: '02/01', montant: '1500' },
    { date: '03/01', montant: '1200' },
    { date: '04/01', montant: '1800' },
    { date: '05/01', montant: '2000' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Statistiques des Montants</Text>
      <BarChart
        data={data}
        width={screenWidth - 40}  // La largeur du graphique
        height={220}  // La hauteur du graphique
        chartConfig={{
          backgroundColor: '#1CC919',
          backgroundGradientFrom: '#8fc3c6',
          backgroundGradientTo: '',
          decimalPlaces: 0,  // Pas de décimales pour les montants
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        verticalLabelRotation={30}  // Rotation des labels sur l'axe X
      />

      {/* Tableau des détails */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Détails des Montants</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>Montant en AR</Text>
        </View>
        {tableData.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.montant}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Assure que le ScrollView prend tout l'espace vertical disponible
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    width: '40%',
    textAlign: 'center',
    paddingVertical: 4,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    color: '#333',
  },
  tableCell: {
    fontSize: 14,
    width: '40%',
    textAlign: 'center',
    paddingVertical: 4,
    color: '#555',
  },
});

export default StatistiqueScreen;
