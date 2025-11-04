import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  FlatList,
} from "react-native";
import { useDimensions } from "../utils/useDimensions";
import { colors } from "../styles/colors";
import DashLactation from "../components/DashLactacao";
import { MainLayout } from "../layouts/MainLayout";
import Bucket from "../../assets/images/bucket.svg";
import Truck from "../../assets/images/truck-side.svg";
import { getCiclosLactacao } from "../services/lactacaoService";
import { Modal as CustomModal } from "../components/Modal";
import { FormColeta } from "../components/FormColeta";
import { FormEstoque } from "../components/FormEstoque";
import { FormLactacao } from "../components/FormLactacao";
import { CardLactacao } from "../components/CardBufaloLactacao";
import { usePropriedade } from "../context/PropriedadeContext";
import { getIndustriasPorPropriedade } from "../services/lactacaoService";

import Button from "../components/Button";

export interface AnimalLac {
  id: string;
  brinco: string;
  nome: string;
  diasEmLactacao: number;
  secagemPrevista?: string;
  ciclo?: number;
  producaoTotal?: number;
  mediaDiaria?: number;
  status: string;
  raca?: string;
}

export const LactacaoScreen = () => {
  const { propriedadeSelecionada } = usePropriedade();
  const [refreshing, setRefreshing] = useState(false);
  const [animais, setAnimais] = useState<AnimalLac[]>([]);
  const [totalLactando, setTotalLactando] = useState<number>(0);
  const [dataFormatada, setDataFormatada] = useState<string | null>(null);
  const [quantidadeAtual, setQuantidadeAtual] = useState<number | null>(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [industrias, setIndustrias] = useState<any[]>([]);
  const [modalLactacaoVisible, setModalLactacaoVisible] = useState(false);
  const [selectedBufala, setSelectedBufala] = useState<AnimalLac | null>(null);
  // paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 10;

  const fetchCiclos = async () => {
    if (!propriedadeSelecionada) return;
    setRefreshing(true);
    try {
      const { ciclos, totalLactando, dataFormatada, quantidadeAtual } =
        await getCiclosLactacao(propriedadeSelecionada);

      const animaisFormatados: AnimalLac[] = ciclos.map((c: any) => ({
        id: c.id,
        nome: c.nome || "Desconhecido",
        brinco: c.brinco || "N/A",
        diasEmLactacao: c.diasEmLactacao || 0,
        secagemPrevista: c.secagemPrevista || "—",
        ciclo: c.numeroCiclo || 0,
        producaoTotal: c.producaoTotal || 0,
        mediaDiaria: c.mediaDiaria || 0,
        status: c.status || "Inativo",
        raca: c.raca || "—",
      }));

      setAnimais(animaisFormatados);
      setTotalPaginas(Math.ceil(animaisFormatados.length / itensPorPagina));
      setTotalLactando(totalLactando);
      setDataFormatada(dataFormatada);
      setQuantidadeAtual(quantidadeAtual);
    } catch (error) {
      console.error("Erro ao buscar ciclos de lactação:", error);
      setAnimais([]);
      setTotalPaginas(1);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!propriedadeSelecionada) return;
      await fetchCiclos();
      };
    fetchData();
  }, [propriedadeSelecionada]);

    const onRefresh = async () => {
      await fetchCiclos();
    };

  // fatia a lista de acordo com a página atual
  const animaisPaginados = animais.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.header1Text}>Lactação</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setModalVisible1(true)}
            style={styles.button}
          >
            <Bucket width={18} height={18} style={{ margin: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible2(true)}
            style={styles.button}
          >
            <Truck width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scroll geral */}
      <MainLayout>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dashboard */}
          <DashLactation
            totalArmazenado={quantidadeAtual || 0}
            vacasLactando={totalLactando}
            dataAtualizacao={dataFormatada || "N/D"}
          />

          {/* Lista paginada */}
          <FlatList
            data={animaisPaginados}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} 
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
                <CardLactacao animal={item} onPress={() => {
                  setSelectedBufala(item);
                  setModalLactacaoVisible(true);
                }}/>
            )}
            contentContainerStyle={styles.content}
            ListFooterComponent={
              totalPaginas > 1 ? (
                <View style={styles.pagination}>
                  <Button
                    title="Anterior"
                    onPress={() => {
                      if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
                    }}
                    disabled={paginaAtual === 1}
                  />
                  <Text style={styles.pageInfo}>
                    Página {paginaAtual} de {totalPaginas}
                  </Text>
                  <Button
                    title="Próxima"
                    onPress={() => {
                      if (paginaAtual < totalPaginas)
                        setPaginaAtual(paginaAtual + 1);
                    }}
                    disabled={paginaAtual === totalPaginas}
                  />
                </View>
              ) : null
            }
          />
        </ScrollView>
      </MainLayout>

      {/* Modais */}
      <CustomModal visible={modalVisible1} onClose={() => setModalVisible1(false)}>
        <FormEstoque onSuccess={() => setModalVisible1(false)} />
      </CustomModal>

      <CustomModal visible={modalVisible2} onClose={() => setModalVisible2(false)}>
        <FormColeta
          industrias={industrias}
          onSuccess={() => setModalVisible2(false)}
        />
      </CustomModal>

      <CustomModal
        visible={modalLactacaoVisible}
        onClose={() => setModalLactacaoVisible(false)}
      >
        {selectedBufala && (
          <FormLactacao
            animais={[
              {
                id_bufala: selectedBufala.id,
                brinco: selectedBufala.brinco,
              },
            ]}
            onSuccess={() => setModalLactacaoVisible(false)}
          />
        )}
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 80,
    backgroundColor: colors.yellow.base,
    justifyContent: "center",
    paddingLeft: 16,
  },
  header1Text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    color: colors.brown.base,
  },
  headerButtons: {
    marginTop: 25,
    flexDirection: "row",
    position: "absolute",
    right: 20,
    gap: 20,
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
    borderColor: colors.gray.disabled,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  pageInfo: {
    marginHorizontal: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});
