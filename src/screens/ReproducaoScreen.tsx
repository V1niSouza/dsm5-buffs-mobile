import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import { getReproducaoDashboardStats, getReproducoes, ReproducaoDashboardStats } from '../services/reproducaoService';
import { Modal } from '../components/Modal';
import { FormReproducaoAtt } from '../components/FormReproductionAtt';
import { FormReproducaoAdd } from '../components/FormReproductionAdd';
import DashReproduction from '../components/DashReproducao';
import { CardReproducao } from '../components/CardBufaloReproduction';
import Button from '../components/Button';
import AgroCore from '../icons/agroCore';
import { usePropriedade } from '../context/PropriedadeContext';

export const ReproducaoScreen = () => {
  const { propriedadeSelecionada } = usePropriedade();
  const [refreshing, setRefreshing] = useState(false);
  const [reproducoes, setReproducoes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reproducaoSelecionada, setReproducaoSelecionada] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 10;

  const [dashboardStats, setDashboardStats] = useState<ReproducaoDashboardStats>({
    totalEmAndamento: 0,
    totalConfirmada: 0,
    totalFalha: 0,
    ultimaDataReproducao: "-",
  });

  const fetchReproducoes = async (pagina: number) => {
      if (!propriedadeSelecionada) return;
      setLoading(true);
      setRefreshing(true);
      try {
        const statsPromise = getReproducaoDashboardStats(propriedadeSelecionada);
        
        // Passa a página atual e o limite para o serviço
        const listaPromise = getReproducoes(propriedadeSelecionada, pagina, itensPorPagina);      
        
        // Aguarda ambas as chamadas
        const [stats, dadosLista] = await Promise.all([statsPromise, listaPromise]);

        setDashboardStats(stats);
        
        // Ajuste para pegar a lista formatada e os metadados do serviço
        setReproducoes(dadosLista.reproducoes); 
        setTotalPaginas(dadosLista.meta.totalPages);
        setPaginaAtual(pagina); // Define a página que acabou de ser carregada
      } catch (error) {
        console.error(error);
        setReproducoes([]);
        setTotalPaginas(1);
        setPaginaAtual(1);
      } finally {
          // Ocultar o ActivityIndicator apenas após todas as buscas
          setLoading(false); 
          setRefreshing(false);
      }
  };

const onRefresh = async () => {
    await fetchReproducoes(1); 
};

  const handleCardPress = (reproducao: any) => {
    setReproducaoSelecionada(reproducao);
    setModalVisible(true);
  };

const handlePageChange = async (novaPagina: number) => {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    await fetchReproducoes(novaPagina);
};


  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        // Inicia buscando a primeira página (1)
        await fetchReproducoes(1); 
        // Não é mais necessário setLoading(false) aqui, pois está no finally do fetchReproducoes
    }
    fetchData();
}, [propriedadeSelecionada]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AgroCore width={200} height={200} />
        <Text>Carregando reproduções...</Text>
        <ActivityIndicator size="large" color={colors.yellow.static} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Reprodução</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => {
              setReproducaoSelecionada(null);
              setModalVisible(true);
            }}
            style={styles.button}
          >
            <Plus width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <DashReproduction
            emProcesso={dashboardStats.totalEmAndamento}
            confirmadas={dashboardStats.totalConfirmada}
            falhas={dashboardStats.totalFalha}
            ultimaData={dashboardStats.ultimaDataReproducao === "-" ? "-" : dashboardStats.ultimaDataReproducao}
          />

          <View style={styles.content}>
            {reproducoes.map(reproducao => (
              <CardReproducao
                key={reproducao.id}
                reproducao={{
                  brincoBufala: reproducao.brincoVaca,
                  brincoTouro: reproducao.brincoTouro,
                  tipoReproducao: reproducao.tipoInseminacao,
                  concluida: reproducao.tipoParto,
                  dataCruzamento: reproducao.dt_evento,
                  previsaoParto: reproducao.previsaoParto,
                  status: reproducao.status,
                  tipo_parto: reproducao.tipoParto,
                  tipo_inseminacao: reproducao.tipoInseminacao,
                  id_semen: reproducao.id_semen,
                }}
                onPress={() => handleCardPress(reproducao)}
              />
            ))}

            {totalPaginas > 1 && (
              <View style={styles.pagination}>
                <Button
                  title="Anterior"
                  onPress={() => handlePageChange(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                />
                <Text style={styles.pageInfo}>
                  Página {paginaAtual} de {totalPaginas}
                </Text>
                <Button
                  title="Próxima"
                  onPress={() => handlePageChange(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </MainLayout>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 80,
    backgroundColor: colors.yellow.base,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
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
