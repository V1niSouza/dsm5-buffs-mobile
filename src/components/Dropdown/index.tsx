import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDimensions } from '../../utils/useDimensions';

interface LayoutRetanguloSimpleProps {
  titulo: React.ReactNode;
  typeIcon: React.ReactNode;
  backgroundColor?: string;
}

export const LayoutRetanguloSimple: React.FC<LayoutRetanguloSimpleProps> = ({
  titulo,
  typeIcon,
  backgroundColor = '#000',
}) => {
  const { wp, hp } = useDimensions();

  return (
    <View style={[styles.container, {height: hp(12), width: 'auto'}]}>
      <View style={[styles.header, {height: hp(5), width: 'auto'}]}>
        <Text style={styles.textTitulo}>{typeIcon}</Text>
        <Text style={styles.textTitulo}> - </Text>
        <Text style={styles.textTitulo}>{titulo}</Text>
      </View>
      <View style={[styles.body, {height: hp(7), width: 'auto'}]}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDC',
    borderRadius: 20
  },
  header: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    textAlign: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10
  },
  body:{
    backgroundColor: '#000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  textTitulo:{
    color: '#000',
    fontSize: 15  
  }
});
