import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, RefreshControl } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableAnimais, { Animal } from '../components/TableRebanho'; // <-- importa o tipo
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg'; 
import { usePropriedade } from '../context/PropriedadeContext';
import bufaloService from '../services/bufaloService';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainTab: undefined;
  AnimalDetail: { animal: Animal };
};
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export const RebanhoScreen = () => {
  const { wp, hp } = useDimensions();
  const { propriedadeSelecionada } = usePropriedade();
  const [animais, setAnimais] = React.useState<Animal[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = React.useState<Animal[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchBufalos = async () => {
    try {
      const { raw } = await bufaloService.getBufalos();

      const filtrados = raw
      .filter((b: any) => b.id_propriedade === propriedadeSelecionada)
      .map((b: any) => ({
        id: b.id_bufalo,
        status: b.status,
        brinco: b.brinco,
        nome: b.nome,
        raca: b.racaNome,
        sexo: b.sexo === 'M' ? 'Macho' : 'Femêa'
      }));
      setAnimais(filtrados);
      setAnimaisFiltrados(filtrados);
    } catch (err) {
      console.error("Erro ao buscar búfalos:", err);
    }
  };

  useEffect(() => {
    if (propriedadeSelecionada) {
      fetchBufalos();
    }
  }, [propriedadeSelecionada]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBufalos();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Texto centralizado */}
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.header1Text}>Rebanho</Text>
          </View>
        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Tanque")} style={styles.button}>
            <Scanner width={18} height={18} style={{ margin: 4}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Abrir modal")} style={styles.button}>
            <Plus width={15} height={15} style={{ margin: 6}}/>
          </TouchableOpacity>
        </View>
      </View>
      <MainLayout>
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.content}>
            <SearchBar 
              animais={animais} 
              onFiltered={setAnimaisFiltrados}/>
            <TableAnimais
              data={animaisFiltrados}
              onVerMais={(animal: Animal) => {   
                navigation.navigate('AnimalDetail', { animal });
              }}
            />
          </View>
        </ScrollView>
      </MainLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    backgroundColor: colors.yellow.base,
    justifyContent: 'center',
    paddingLeft: 16,
    borderBottomWidth: 0.5,
    borderColor: colors.black.base
  },
  header1Text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    color: colors.brown.base,
  },
  headerButtons: {
    marginTop: 25,
    flexDirection: "row",
    position: "absolute",
    right: 20, // fixa os botões à direita
    gap: 20, // espaço entre eles
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
  header2: {
    height: 35,
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor: colors.yellow.base,
  },
  header2Text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.brown.base,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginBottom: 50,
    borderColor: colors.gray.disabled,
  },
});
