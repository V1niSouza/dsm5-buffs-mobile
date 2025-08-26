import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableReproduction, { Animal } from '../components/TableReproduction';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';

export const ReproducaoScreen = () => {
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

        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Registrar retirada ")} style={styles.button}>
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
        <Text style={styles.header2Text}>Reprodução</Text>
      </Animated.View>

        <MainLayout>
          <ScrollView>
            <View style={styles.container}>
              <SearchBar />
              <TableReproduction
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