import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const StatistiqueScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [scaleFactor, setScaleFactor] = useState(1); // Facteur d'échelle

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/chart/');
        const result = await response.json();

        const labels = result.data.map(item => item.annee.toString());
        const datasets = result.data.map(item => item.total_mnt_ver);

        // Trouver la plus grande valeur pour ajuster l'échelle
        const maxValue = Math.max(...datasets);
        let scale = 1;

        if (maxValue > 1_000_000_000) {
          scale = 1_000_000_000; // Milliards
        } else if (maxValue > 1_000_000) {
          scale = 1_000_000; // Millions
        } else if (maxValue > 1_000) {
          scale = 1_000; // Milliers
        }

        setScaleFactor(scale);

        // Transformer les valeurs pour correspondre à l'échelle
        const scaledData = datasets.map(value => value / scale);

        setData({
          labels,
          datasets: [
            {
              data: scaledData,
            },
          ],
        });

        setTableData(result.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CC919" />
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Somme payée par année ({scaleFactor === 1_000_000_000 ? 'Milliards' : scaleFactor === 1_000_000 ? 'Millions' : scaleFactor === 1_000 ? 'Milliers' : 'Ar'})</Text>

      {data && (
        <BarChart
          data={{
            labels: data.labels,
            datasets: data.datasets,
          }}
          width={screenWidth - 40}
          height={300}
          yAxisLabel=""
          yAxisSuffix={` ${scaleFactor === 1_000_000_000 ? 'Md' : scaleFactor === 1_000_000 ? 'M' : scaleFactor === 1_000 ? 'K' : ''}`}
          yAxisInterval={1} // Ajuste la densité des valeurs affichées
          chartConfig={{
            backgroundColor: '#1CC919',
            backgroundGradientFrom: '#8fc3c6',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1, // Un chiffre après la virgule pour plus de précision
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          fromZero={true}
        />
      )}

      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Détails des Montants</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Année</Text>
          <Text style={styles.tableHeader}>Montant (AR)</Text>
        </View>
        {tableData.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.annee}</Text>
            <Text style={styles.tableCell}>{item.total_mnt_ver.toLocaleString()} AR</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
