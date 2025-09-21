import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { Animal } from '../components/TableRebanho';

type RootStackParamList = {
  MainTab: undefined;
  AnimalDetail: { animal: Animal };
};

type AnimalDetailRouteProp = RouteProp<RootStackParamList, 'AnimalDetail'>;

export const AnimalDetailScreen = () => {
  const route = useRoute<AnimalDetailRouteProp>();
  const { animal } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{animal.nome}</Text>
      <Text>Brinco: {animal.brinco}</Text>
      <Text>Raça: {animal.raca ?? 'Sem raça'}</Text>
      <Text>Sexo: {animal.sexo}</Text>
      <Text>Status: {animal.status ? 'Ativo' : 'Inativo'}</Text>
      <Text>Categoria: {animal.categoria}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
