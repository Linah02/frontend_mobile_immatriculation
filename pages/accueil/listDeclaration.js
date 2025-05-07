import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ListeDeclaration = ({ id_contribuable }) => {
  const [declarations, setDeclarations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeclarations = async () => {
    try {
      const response = await fetch('https://api-mobile-immatriculation.onrender.com/api/api_list_declaration_de/?page=1');

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des déclarations');
      }

      const data = await response.json();
      if (data && data.results) {
        setDeclarations(data.results);
      } else {
        setError('Aucune déclaration trouvée');
      }

    } catch (err) {
      console.error('Erreur API:', err);
      setError('Erreur de chargement des déclarations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(declarations.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => toggleCheckbox(item.id)} style={styles.checkbox}>
            <Ionicons
              name={isSelected ? 'checkbox' : 'square-outline'}
              size={22}
              color={isSelected ? '#a9d8de' : '#aaa'}
            />
          </TouchableOpacity>
          <Text style={styles.date}>{item.date_declaration}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.label}>Base Imposable:</Text>
          <Text style={styles.value}>{(item.base_imposable || 0).toLocaleString('fr-FR')} Ar</Text>

          <Text style={styles.label}>Type de Droit:</Text>
          <Text style={styles.value}>{item.nom_type_droit}</Text>

          <Text style={styles.label}>Taux:</Text>
          <Text style={styles.value}>{item.taux} %</Text>

          <Text style={styles.label}>À Payer:</Text>
          <Text style={styles.value}>{(item.mnt_ap || 0).toLocaleString('fr-FR')} Ar</Text>
        </View>
      </View>
    );
  };

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
      <Text style={styles.title}>Mes Déclarations</Text>
      <View style={styles.selectAllContainer}>
        <TouchableOpacity onPress={toggleSelectAll} style={styles.checkbox}>
          <Ionicons
            name={selectAll ? 'checkbox' : 'square-outline'}
            size={22}
            color={selectAll ? '#a9d8de' : '#aaa'}
          />
        </TouchableOpacity>
        <Text style={styles.selectAllText}>Tout sélectionner</Text>
      </View>

      <FlatList
        data={declarations}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5caeb6',

    marginBottom: 15,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 14,
    color: '#555',
  },
  checkbox: {
    marginRight: 10,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cardContent: {
    marginLeft: 30,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
});

export default ListeDeclaration;
