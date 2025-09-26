import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableReproduction, { Animal } from '../components/TableReproduction';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import SimpleSearch from '../components/SimpleSearch';
import { getReproducoes } from '../services/reproducaoService';

export const ReproducaoScreen = () => {
  const { wp, hp } = useDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [animais, setAnimais] = useState<Animal[]>([]);


  const fetchReproducoes = async () => {
    setRefreshing(true);
    try {
      const data = await getReproducoes();
      setAnimais(data);
    } catch (error) {
      console.error(error);
      setAnimais([]);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReproducoes();
  }, []);

  const onRefresh = async () => {
    await fetchReproducoes();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Reprodução</Text>
        </View>

        {/* Botão à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Registrar cobertura")} style={styles.button}>
            <Plus width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.content}>
            <TableReproduction
              data={animais}
              onVerMais={(animal: Animal) => {
                console.log("Ver mais sobre:", animal);
              }}
            />
          </View>
        </ScrollView>
      </MainLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    height: 80, 
    backgroundColor: colors.yellow.base, 
    justifyContent: 'center', 
    paddingLeft: 16, 
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
  header1Text: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginTop: 30, 
    color: colors.brown.base 
  },
  headerButtons: { 
    marginTop: 25, 
    flexDirection: "row", 
    position: "absolute", 
    right: 20, 
    gap: 20 
  },
  container: {
    flex: 1,
  },
  content: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    paddingTop: 16, 
    paddingBottom: 16, 
    paddingHorizontal: 10, 
    borderWidth: 1, 
    marginBottom: 50, 
    borderColor: colors.gray.disabled 
  },
});