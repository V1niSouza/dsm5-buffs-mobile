import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import { MapLeaflet } from '../components/Mapa';

export const PiquetesScreen = () => {
  const { wp, hp } = useDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const [piqueteCoords, setPiqueteCoords] = useState([ { latitude: -24.497, longitude: -47.842 }, { latitude: -24.496, longitude: -47.841 }, { latitude: -24.495, longitude: -47.843 }, ]);


  const onRefresh = async () => {
    setRefreshing(true);
    // aqui você pode recarregar as coordenadas da API
    setRefreshing(false);
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>lotes/piquetes</Text>
        </View>
        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => console.log("Registrar novo Piquete")}
            style={styles.button}
          >
            <Plus width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            <MapLeaflet piqueteCoords={piqueteCoords}/>
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
    borderColor: colors.black.base,
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
  header1Text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: colors.brown.base,
  },
  headerButtons: {
    marginTop: 25,
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    gap: 20,
  },
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginBottom: 50,
    borderColor: colors.gray.disabled,
  },
});
