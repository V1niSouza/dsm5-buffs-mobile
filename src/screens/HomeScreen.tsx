import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { LayoutRetanguloSimple } from '../components/Dropdown';
import { useDimensions } from '../utils/useDimensions';
import Movimentacoes from '../components/Movimentacoes';
import AlertasPendentes from '../components/Lembretes';

export const HomeScreen = () => {
  const { wp, hp } = useDimensions();

  return (
    <MainLayout>
      <View style={styles.container}>
        <ScrollView>
          <View>
            <LayoutRetanguloSimple typeIcon="XXX" titulo="Propriedades"/>
          </View>
          <View style={{marginTop: 10}}>
            <AlertasPendentes />
          </View>
          <View style={{marginTop: 10}}>
            <Movimentacoes/>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};


const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#a14848ff',
    flex: 1,
   },
});

