import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableAnimais, { Animal } from '../components/TableRebanho'; // <-- importa o tipo
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg'; 



export const RebanhoScreen = () => {
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
    { id: 1, status: true, brinco: "A123", nome: "Estrela", raca: "Murrah", sexo: "Fêmea" },
    { id: 2, status: false, brinco: "B456", nome: "TouroX", raca: "Mediterrâneo", sexo: "Macho" },
    { id: 3, status: true, brinco: "C789", nome: "Luna", raca: "Jafarabadi", sexo: "Fêmea" },
    { id: 4, status: true, brinco: "D101", nome: "Bella", raca: "Murrah", sexo: "Fêmea" },
    { id: 5, status: false, brinco: "E202", nome: "Max", raca: "Mediterrâneo", sexo: "Macho" },
    { id: 6, status: true, brinco: "F303", nome: "Mila", raca: "Jafarabadi", sexo: "Fêmea" },
    { id: 7, status: true, brinco: "G404", nome: "Thor", raca: "Murrah", sexo: "Macho" },
    { id: 8, status: false, brinco: "H505", nome: "Nina", raca: "Mediterrâneo", sexo: "Fêmea" },
    { id: 9, status: true, brinco: "I606", nome: "Rocky", raca: "Jafarabadi", sexo: "Macho" },
    { id: 10, status: true, brinco: "J707", nome: "Daisy", raca: "Murrah", sexo: "Fêmea" },
    { id: 11, status: false, brinco: "K808", nome: "Brutus", raca: "Mediterrâneo", sexo: "Macho" },
    { id: 12, status: true, brinco: "L909", nome: "Lola", raca: "Jafarabadi", sexo: "Fêmea" },
    { id: 13, status: false, brinco: "M010", nome: "Hercules", raca: "Murrah", sexo: "Macho" },
    { id: 14, status: true, brinco: "N111", nome: "Sophie", raca: "Mediterrâneo", sexo: "Fêmea" },
    { id: 15, status: true, brinco: "O212", nome: "Zeus", raca: "Jafarabadi", sexo: "Macho" },
    { id: 16, status: false, brinco: "P313", nome: "Chloe", raca: "Murrah", sexo: "Fêmea" },
    { id: 17, status: true, brinco: "Q414", nome: "Rocky II", raca: "Mediterrâneo", sexo: "Macho" },
    { id: 18, status: true, brinco: "R515", nome: "Bella II", raca: "Jafarabadi", sexo: "Fêmea" },
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
          Rebanho
        </Animated.Text>

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

    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: 25 }}
    >
      <Animated.View style={[styles.header2, { opacity: header2Opacity }]}>
        <Text style={styles.header2Text}>Rebanho</Text>
      </Animated.View>


      <MainLayout>
        <ScrollView>
          <View style={styles.container}>
            <SearchBar />
            <TableAnimais
              data={animais}
              onVerMais={(animal: Animal) => {   // <-- adiciona a tipagem aqui
                console.log("Ver mais sobre:", animal);
                // ex: navigation.navigate("AnimalDetalhes", { animal })
              }}
            />
          </View>
        </ScrollView>
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
