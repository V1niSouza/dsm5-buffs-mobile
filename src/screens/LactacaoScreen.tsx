import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import { useDimensions } from '../utils/useDimensions';
import TableLactation, { Animal } from '../components/TableLactation';
import { colors } from '../styles/colors';
import DashLactation from '../components/DashLactacao';
import { MainLayout } from '../layouts/MainLayout';
import Bucket from '../../assets/images/bucket.svg';
import Truck from '../../assets/images/truck-side.svg';
import SimpleSearch from '../components/SimpleSearch';

export const LactacaoScreen = () => {
  const { wp, hp } = useDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Lactação</Text>
        </View>

        {/* Botões à direita */}
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => console.log("Registrar medida do tanque")} 
            style={styles.button}
          >
            <Bucket width={18} height={18} style={{ margin: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => console.log("Registrar retirada")} 
            style={styles.button}
          >
            <Truck width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <DashLactation />
          <View style={styles.content}>
            <SimpleSearch animais={animais} onFiltered={(filtered) => console.log("Animais filtrados:", filtered)} />
            <TableLactation
                data={animais}
                onVerMais={(animal: Animal) => console.log("Ver mais:", animal)}
              />
          </View>
        </ScrollView>
      </MainLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    height: 80, 
    backgroundColor: colors.yellow.base, 
    justifyContent: 'center', 
    paddingLeft: 16, 
    borderBottomWidth: 0.5, 
    borderColor: colors.black.base 
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
