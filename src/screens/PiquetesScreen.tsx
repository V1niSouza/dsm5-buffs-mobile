import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import { colors } from '../styles/colors';

export const PiquetesScreen = () => {
  const { wp, hp } = useDimensions();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Faz sumir o header 2 ao rolar a tela
  const header2Opacity = scrollY.interpolate({
    inputRange: [0, 50], // altura do scroll para desaparecer
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Quando header2 some: O titulo aparece no header1
  const header1TextOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });


  return (
    <View>
      <View style={styles.headerNotifications}>
        {/* Texto centralizado */}
        <Animated.Text 
          style={[
            styles.header1Text, 
            { opacity: header1TextOpacity }
          ]}
        >
          Reprodução
        </Animated.Text>
      </View>

    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: 25 }}
    >
      <Animated.View style={[styles.header2, { opacity: header2Opacity }]}>
        <Text style={styles.header2Text}>Reprodução</Text>
      </Animated.View>
        <MainLayout>
          <Text>Teste Piquetes</Text> 
        </MainLayout>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    headerNotifications: {
    height: 60,
    backgroundColor: colors.yellow.base,
    paddingLeft: 16,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // mantém o texto no centro
    position: "relative",
    paddingVertical: 10,
  },
  header1Text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    flex: 1, // garante centralização
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
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    marginBottom: 50,
    borderColor: colors.gray.disabled,
  },
});
