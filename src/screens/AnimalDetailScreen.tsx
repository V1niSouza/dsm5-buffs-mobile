import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { colors } from "../styles/colors";
import { Tabs } from "../components/Tabs";
import { AnimalInfoCard } from "../components/AnimalInfoCard";
import { ZootecnicoCard } from "../components/ZootecnicoCard";
import { SanitarioCard } from "../components/SanitarioCard";
import bufaloService from "../services/bufaloService";
import zootecnicoService from "../services/zootecnicoService";
import sanitarioService from "../services/sanitarioService";
import { MainLayout } from "../layouts/MainLayout";
import Back from '../../assets/images/arrow.svg';
import AgroCore from '../../src/icons/agroCore'; 
import YellowButton from "../components/Button";
import Button from "../components/Button";
import { ZootecnicoDetailModal } from "../components/ModalVisualizaçãoZootec";
import { SanitarioDetailModal } from "../components/ModalVisualizacaoSanit";


type RootStackParamList = {
  AnimalDetail: { id: string };
};

type AnimalDetailRouteProp = RouteProp<RootStackParamList, "AnimalDetail">;

export const AnimalDetailScreen = () => {
  const route = useRoute<AnimalDetailRouteProp>();
  const { id } = route.params;
  const navigation = useNavigation<{ goBack: () => void }>();
  const [tab, setTab] = useState<"info" | "zootec" | "sanit">("info");
  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const PAGE_SIZE = 10;
  const [pageZootec, setPageZootec] = useState(1);
  const [totalPagesZootec, setTotalPagesZootec] = useState(1);
  const [pageSanit, setPageSanit] = useState(1); 
  const [totalPagesSanit, setTotalPagesSanit] = useState(1); 

  const [selectedZootec, setSelectedZootec] = useState<any>(null);
  const [selectedSanit, setSelectedSanit] = useState<any>(null);

const fetchData = async (
    pageZootecToLoad = pageZootec, 
    pageSanitToLoad = pageSanit
  ) => {
    setLoading(true);
    try {
      const base = await bufaloService.getBufaloDetalhes(id);
      
      // 1. Fetch Zootécnico (usa a página exata)
      const zootResp = await zootecnicoService.getHistorico(id, pageZootecToLoad, PAGE_SIZE);
      setTotalPagesZootec(zootResp.meta?.totalPages ?? 1);
      
      // 2. Fetch Sanitário (usa a página exata)
      const sanitResp = await sanitarioService.getHistorico(id, pageSanitToLoad, PAGE_SIZE);
      setTotalPagesSanit(sanitResp.meta?.totalPages ?? 1);

      setDetalhes({
        ...base,
        dadosZootecnicos: zootResp.data || [],
        dadosSanitarios: sanitResp.data || [],
      });

    } catch (err) {
      console.error("Erro ao buscar dados do búfalo:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para mudar a página Zootécnico
  const changePageZootec = (newPage: number) => {
    setPageZootec(newPage);
    fetchData(newPage, pageSanit); // Carrega a nova página de Zootec e mantém Sanitário
  }
  
  // Função para mudar a página Sanitário
  const changePageSanit = (newPage: number) => {
    setPageSanit(newPage);
    fetchData(pageZootec, newPage); // Carrega a nova página de Sanitário e mantém Zootec
  }

  // Função de Refresh (volta para a primeira página)
  const onRefresh = async () => {
    setRefreshing(true);
    setPageZootec(1);
    setPageSanit(1);
    await fetchData(1, 1);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const PaginationComponent = ({ 
    paginaAtual, 
    totalPaginas, 
    onPageChange,
    isLoading
  }: {
    paginaAtual: number,
    totalPaginas: number,
    onPageChange: (page: number) => void,
    isLoading: boolean
  }) => (
  <View style={styles.pagination}>
    <Button
        title="Anterior"
        onPress={() => onPageChange(paginaAtual - 1)}
        disabled={paginaAtual === 1 || isLoading}
      />
      <Text style={styles.pageInfo}>Página {paginaAtual} de {totalPaginas}</Text>
      <Button
        title="Próxima"
        onPress={() => onPageChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas || isLoading}
      />
  </View>
  );

  if (loading && !detalhes) {
    return (
      <View style={styles.loadingContainer}>
        <AgroCore width={200} height={200} />
        <Text>Carregando Prontuário do Animal...</Text>
        <ActivityIndicator size="large" color={colors.yellow.static} />
      </View>
    );
  }

  const tabOptions = [
    { key: "info", label: "Informações" },
    { key: "zootec", label: "Zootécnico" },
    { key: "sanit", label: "Sanitário" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ alignItems: 'center', flexDirection: 'row', alignContent: 'center', marginTop: 20, gap: 60 }}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Back width={25} height={25} style={{ margin: 6 }} />
          </TouchableOpacity>
          <Text style={styles.header1Text}>Prontuário: {detalhes.brinco}</Text>
        </View>
      </View>

      <MainLayout>     
        <Tabs tabs={tabOptions} activeTab={tab}   onChange={(key: string) => {
          if (key === "info" || key === "zootec" || key === "sanit") {
            setTab(key);
          }
        }} />
        <View style={styles.cardContainer}>
          {tab === "info" && <AnimalInfoCard detalhes={detalhes} />}
          {tab === "zootec" && (
            <>
              <FlatList
                data={detalhes.dadosZootecnicos}
                keyExtractor={(item) => item.id_zootec.toString()}
                renderItem={({ item }) => <ZootecnicoCard item={item} onPress={() => setSelectedZootec(item)} />}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registro.</Text>}
                ListFooterComponent={() =>
                  detalhes.dadosZootecnicos.length > 0 ? (
                    <PaginationComponent 
                      paginaAtual={pageZootec}
                      totalPaginas={totalPagesZootec}
                      onPageChange={changePageZootec}
                      isLoading={loading}
                />
                ) : null
              }
            />
            </>
          )}
          {tab === "sanit" && (
              <FlatList
                data={detalhes.dadosSanitarios}
                keyExtractor={(item) => item.id_sanit.toString()}
                renderItem={({ item }) => <SanitarioCard item={item} onPress={() => setSelectedSanit(item)} />}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registro.</Text>}
                ListFooterComponent={() =>
                  detalhes.dadosSanitarios.length > 0 ? (
                  <PaginationComponent 
                    paginaAtual={pageSanit}
                    totalPaginas={totalPagesSanit}
                    onPageChange={changePageSanit}
                    isLoading={loading}
                      />
                    ) : null
                }
              />
            )}
        </View>
        <ZootecnicoDetailModal visible={!!selectedZootec} item={selectedZootec} onClose={() => setSelectedZootec(null)} />
        <SanitarioDetailModal visible={!!selectedSanit} item={selectedSanit} onClose={() => setSelectedSanit(null)} />    
      </MainLayout> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.gray.disabled 
  },
  headerButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    headerArrow: {
      fontSize: 28,
      fontWeight: '300',
      color: colors.brown.base,
    },
  cardContainer: {
    borderTopWidth: 2, 
    borderColor: colors.gray.disabled, 
    paddingTop: 16, 
    marginTop: 10,
    flex: 1
  },
  header: { 
    height: 80, 
    backgroundColor: colors.yellow.base, 
    justifyContent: 'center', 
    paddingLeft: 16 
  },
  header1Text: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: colors.brown.base 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  emptyText: { 
    textAlign: "center", 
    color: colors.gray.base, 
    marginTop: 20 
  },
  pageInfo: {
    marginHorizontal: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
    marginBottom: 40
  },
});
