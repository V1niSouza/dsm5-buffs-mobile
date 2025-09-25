import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import { useDimensions } from '../utils/useDimensions';
import TableLactation, { AnimalLac } from '../components/TableLactation';
import { colors } from '../styles/colors';
import DashLactation from '../components/DashLactacao';
import { MainLayout } from '../layouts/MainLayout';
import Bucket from '../../assets/images/bucket.svg';
import Truck from '../../assets/images/truck-side.svg';
import SimpleSearch from '../components/SimpleSearch';
import { getCiclosLactacao } from '../services/lactacaoService';

export const LactacaoScreen = () => {
  const { wp, hp } = useDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [animais, setAnimais] = useState<AnimalLac[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = useState<AnimalLac[]>([]);
  const [totalLactando, setTotalLactando] = useState<number>(0);
  const [dataFormatada, setDataFormatada] = useState<any | null>(null);
  const [quantidadeAtual, setQuantidadeAtual] = useState<any | null>(true);

  const fetchCiclos = async () => {
    setRefreshing(true);
    try {
      const { ciclos, totalLactando, dataFormatada, quantidadeAtual } = await getCiclosLactacao();
      const animaisFormatados: AnimalLac[] = ciclos.map(c => ({
        id: c.id_ciclo_lactacao,
        status: c.status === "Lactando",
        brinco: c.bufalo?.nome || "Desconhecido",
        raca: c.bufalo?.raca || "Desconhecida",
        mediaProduzida: 0
      }));
      setAnimais(animaisFormatados);
      setAnimaisFiltrados(animaisFormatados);
      setTotalLactando(totalLactando); 
      setDataFormatada(dataFormatada);
      setQuantidadeAtual(quantidadeAtual);
    } catch (error) {
      console.error("Erro ao buscar ciclos de lactação:", error);
      setAnimais([]);
      setAnimaisFiltrados([]);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCiclos();
  }, []);

  const onRefresh = async () => {
    await fetchCiclos();
  };


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
          <DashLactation
            totalArmazenado={quantidadeAtual || 0}
            vacasLactando={totalLactando}
            dataAtualizacao={dataFormatada || "N/D"} />
          <View style={styles.content}>
          <SimpleSearch 
            animais={animais} 
            onFiltered={(filtered) => setAnimaisFiltrados(filtered)} 
          />

          <TableLactation
            data={animaisFiltrados} // 👈 usa filtrados aqui
            onVerMais={(animal: AnimalLac) => console.log("Ver mais:", animal)}
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
