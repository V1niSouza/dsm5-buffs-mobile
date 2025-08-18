import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';

export const ReproducaoScreen = () => {
  const { wp, hp } = useDimensions();

  return (
    <MainLayout>
      <Text>Teste Rerproducao</Text> 
    </MainLayout>
  );
};

