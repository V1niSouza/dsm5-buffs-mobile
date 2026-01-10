import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { colors } from "../styles/colors";
import DashLactation from "../components/DashLactacao";
import { MainLayout } from "../layouts/MainLayout";
import Bucket from "../../assets/images/bucket.svg";
import Truck from "../../assets/images/truck-side.svg";
import { getCiclosLactacao } from "../services/lactacaoService";
import { Modal as CustomModal } from "../components/Modal";
import { ColetaAddBottomSheet } from "../components/FormColeta";
import { CardLactacao } from "../components/CardBufaloLactacao";
import { usePropriedade } from "../context/PropriedadeContext";
import { getIndustriasPorPropriedade } from "../services/lactacaoService";
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg';

import Button from "../components/Button";
import AgroCore from "../icons/agroCore";
import { LactacaoAddBottomSheet } from "../components/FormLactacao";
import { FloatingAction } from "react-native-floating-action";
import { EstoqueAddBottomSheet } from "../components/FormEstoque";
import BuffaloLoader from "../components/BufaloLoader";

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
  idCicloLactacao?: string;
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
  const [selectedBufala, setSelectedBufala] = useState<AnimalLac | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 10;
  const [isAddingLactacao, setIsAddingLactacao] = useState(false);
  const [isAddingColeta, setIsAddingColeta] = useState(false);
  const [isAddingEstoque, setIsAddingEstoque] = useState(false);

  const fetchCiclos = async () => {
    if (!propriedadeSelecionada) return;

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
        idCicloLactacao: c.idCicloLactacao,
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

    }
  };

const fetchIndustrias = async () => {
    if (!propriedadeSelecionada) return;
    try {
      const response = await getIndustriasPorPropriedade(propriedadeSelecionada);
      // Sua função getIndustriasPorPropriedade retorna response ou um array?
      // Pela definição do service, ela retorna um objeto com { data: Industria[] }
      setIndustrias(response); 
    } catch (error) {
      console.error("Erro ao buscar indústrias:", error);
      setIndustrias([]);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (propriedadeSelecionada){
        await fetchCiclos();
        await fetchIndustrias();
      }
      setLoading(false);
    };
    fetchData();
  }, [propriedadeSelecionada]);

  const onRefresh = async () => {
      if (!propriedadeSelecionada) return;
      setRefreshing(true); // Ativa o RefreshControl
      try {
          await fetchCiclos();
          await fetchIndustrias();
      } catch (error) {
          console.error("Erro no refresh:", error);
      } finally {
          setRefreshing(false); // ✅ Desativa o RefreshControl (garantido)
      }
  };

  const animaisPaginados = animais.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const actions = [
    {
      text: "Atualizar Estoque",
      icon: <Bucket width={18} height={18} style={{ margin: 4 }} />, 
      name: "estqoue",
      position: 1,
      color: colors.yellow.base,
    },
    {
      text: "Registrar Coleta",
      icon: <Truck width={15} height={15} style={{ margin: 6 }} />, 
      name: "coleta",
      position: 2,
      color: colors.yellow.base,
    },
  ];
  const handleActionPress = (name: string | undefined) => {
    if (name === "estqoue") {
      setIsAddingEstoque(true)
    } else if (name === "coleta") {
      setIsAddingColeta(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BuffaloLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.header1Text}>Lactação</Text>
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
      <FloatingAction
        actions={actions}
        onPressItem={handleActionPress}
        buttonSize={60}
        color={colors.yellow.dark} 
        floatingIcon={<Plus width={24} height={24} fill={'black'} />} 
        position="right" 
      />

    {isAddingEstoque && (
        <EstoqueAddBottomSheet
            propriedadeId={propriedadeSelecionada!}
            onClose={() => setIsAddingEstoque(false)}
            onSuccess={() => {
                setIsAddingEstoque(false);
                // Atualiza o DashLactation com a nova quantidade
                fetchCiclos(); 
            }}
        />
    )}

      {isAddingColeta && (
        <ColetaAddBottomSheet
            industrias={industrias}
            propriedadeId={propriedadeSelecionada!}
            onClose={() => setIsAddingColeta(false)}
            onSuccess={() => {
                setIsAddingColeta(false);
            }}
        />
      )}

      {!!selectedBufala && (
        <LactacaoAddBottomSheet
            animais={[
              {
                id_bufala: selectedBufala.id,
                brinco: selectedBufala.brinco,
                id_ciclo_lactacao: selectedBufala.idCicloLactacao || '',
              },
            ]}
            propriedadeId={propriedadeSelecionada!}
            onClose={() => setSelectedBufala(null)} // Fecha ao limpar o estado
            onSuccess={() => {
                setSelectedBufala(null); // Fecha
            }}
        />
      )}
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
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
});
