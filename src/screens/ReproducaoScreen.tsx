import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableReproduction, { Animal } from '../components/TableReproduction';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import SimpleSearch from '../components/SimpleSearch';

export const ReproducaoScreen = () => {
  const { wp, hp } = useDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };


  const animais: Animal[] = [
    { id: 1, status: true,  brincoVaca: "V001", brincoTouro: "T101", tipoInseminacao: "IA" },
    { id: 2, status: false, brincoVaca: "V002", brincoTouro: "T102", tipoInseminacao: "Natural" },
    { id: 3, status: true,  brincoVaca: "V003", brincoTouro: "T103", tipoInseminacao: "IATF"},
    { id: 4, status: false, brincoVaca: "V004", brincoTouro: "T104", tipoInseminacao: "IA" },
    { id: 5, status: true,  brincoVaca: "V005", brincoTouro: "T105", tipoInseminacao: "Natural" },
    { id: 6, status: true,  brincoVaca: "V006", brincoTouro: "T106", tipoInseminacao: "IATF" },
    { id: 7, status: false, brincoVaca: "V007", brincoTouro: "T107", tipoInseminacao: "IA" },
    { id: 8, status: true,  brincoVaca: "V008", brincoTouro: "T108", tipoInseminacao: "Natural" },
    { id: 9, status: false, brincoVaca: "V009", brincoTouro: "T109", tipoInseminacao: "IATF" },
    { id: 10, status: true, brincoVaca: "V010", brincoTouro: "T110", tipoInseminacao: "IA" },
  ];


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Reprodução</Text>
        </View>

        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Registrar retirada ")} style={styles.button}>
            <Plus width={15} height={15} style={{ margin: 6}}/>
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            <View style={styles.container}>
              <View style={styles.content}>
                <TableReproduction
                  data={animais}
                  onVerMais={(animal: Animal) => {   // <-- adiciona a tipagem aqui
                    console.log("Ver mais sobre:", animal);
                    // ex: navigation.navigate("AnimalDetalhes", { animal })
                  }}
                  />
                </View>
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
    borderBottomWidth: 0.5, 
    borderColor: colors.black.base 
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