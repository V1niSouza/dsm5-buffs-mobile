import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useDimensions } from '../utils/useDimensions';
import TableLactation, { Animal } from '../components/TableLactation';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import DashLactation from '../components/DashLactacao';
import { MainLayout } from '../layouts/MainLayout';
import Bucket from '../../assets/images/bucket.svg';
import Truck from '../../assets/images/truck-side.svg';

export const LactacaoScreen = () => {
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

  const animais: Animal[] = [
    { id: 1, status: true, brinco: "A123", raca: "Murrah", mediaProduzida: 12.5 },
    { id: 2, status: false, brinco: "B456", raca: "Mediterrâneo", mediaProduzida: 8.9 },
    { id: 3, status: true, brinco: "C789", raca: "Jafarabadi", mediaProduzida: 15.2 },
    { id: 4, status: true, brinco: "D101", raca: "Murrah", mediaProduzida: 11.0 },
    { id: 5, status: false, brinco: "E202", raca: "Mediterrâneo", mediaProduzida: 7.4 },
    { id: 6, status: true, brinco: "F303", raca: "Jafarabadi", mediaProduzida: 14.1 },
    { id: 7, status: true, brinco: "G404", raca: "Murrah", mediaProduzida: 10.8 },
    { id: 8, status: false, brinco: "H505", raca: "Mediterrâneo", mediaProduzida: 9.6 },
    { id: 9, status: true, brinco: "I606", raca: "Jafarabadi", mediaProduzida: 13.7 },
    { id: 10, status: true, brinco: "J707", raca: "Murrah", mediaProduzida: 12.9 },
    { id: 11, status: false, brinco: "K808", raca: "Mediterrâneo", mediaProduzida: 8.3 },
    { id: 12, status: true, brinco: "L909", raca: "Jafarabadi", mediaProduzida: 14.8 },
    { id: 13, status: false, brinco: "M010", raca: "Murrah", mediaProduzida: 9.2 },
    { id: 14, status: true, brinco: "N111", raca: "Mediterrâneo", mediaProduzida: 11.5 },
    { id: 15, status: true, brinco: "O212", raca: "Jafarabadi", mediaProduzida: 13.1 },
    { id: 16, status: false, brinco: "P313", raca: "Murrah", mediaProduzida: 7.9 },
    { id: 17, status: true, brinco: "Q414", raca: "Mediterrâneo", mediaProduzida: 12.2 },
    { id: 18, status: true, brinco: "R515", raca: "Jafarabadi", mediaProduzida: 15.0 },
  ];

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
          Lactação
        </Animated.Text>

        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Registrar medida do tanque")} style={styles.button}>
            <Bucket width={18} height={18} style={{ margin: 4}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Registrar retirada ")} style={styles.button}>
            <Truck width={15} height={15} style={{ margin: 6}}/>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.header2Text}>Lactação</Text>
      </Animated.View>

        <MainLayout>
          {/* Dashboard */}
          <DashLactation />
          <View style={styles.container}>
            <SearchBar />
            <TableLactation
              data={animais}
              onVerMais={(animal: Animal) => console.log("Ver mais:", animal)}
            />
          </View>
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
