import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import BuffsLogo from '../../assets/images/logoBuffs.svg';

export const LoadingScreen = ({ }) => (
  <View style={styles.container}>
        <View style={{alignItems: 'center', marginTop: 150}}>
          <BuffsLogo width={300} height={300}/>
        </View>
    <ActivityIndicator size={44} color={colors.yellow.dark} />
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
    },
    text: { 
     marginTop: 16, 
    fontSize: 16, 
    color: '#333' 
},
});