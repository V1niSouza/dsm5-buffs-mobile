import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { Animal } from '../components/TableRebanho';
import { MainLayout } from '../layouts/MainLayout';
import bufaloService from '../services/bufaloService';
import zootecnicoService from '../services/zootecnicoService';
import sanitarioService from '../services/sanitarioService';
import { Loading } from '../components/Loading';
import { Modal } from "../components/Modal";
import { FormZootecnico } from "../components/FormZootecnico";
import { FormSanitario } from "../components/FormSanitario";
import { ConfirmModal } from '../components/ModalDeleteConfirm';

type RootStackParamList = {
  AnimalDetail: { animal: Animal };
};

type AnimalDetailRouteProp = RouteProp<RootStackParamList, 'AnimalDetail'>;

export const AnimalDetailScreen = () => {
  const route = useRoute<AnimalDetailRouteProp>();
  const { animal } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'zootec' | 'sanitario'>('zootec');

  const [confirmDeleteZootecVisible, setConfirmDeleteZootecVisible] = useState(false);
  const [confirmDeleteSanitarioVisible, setConfirmDeleteSanitarioVisible] = useState(false);

  const [selectedZootec, setSelectedZootec] = useState<any>(null);
  const [selectedSanitario, setSelectedSanitario] = useState<any>(null);

  // paginação
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchAllData();
    setRefreshing(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const base = await bufaloService.getBufaloDetalhes(animal.id);
      let zoot = await zootecnicoService.getHistorico(animal.id);
      let sanit = await sanitarioService.getHistorico(animal.id);

      // ordenar do mais recente para o mais antigo
      zoot = zoot.sort((a: any, b: any) => new Date(b.dt_registro).getTime() - new Date(a.dt_registro).getTime());
      sanit = sanit.sort((a: any, b: any) => new Date(b.dt_aplicacao).getTime() - new Date(a.dt_aplicacao).getTime());

      setDetalhes({ ...base, dadosZootecnicos: zoot, dadosSanitarios: sanit });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [animal.id]);

  // Funções de render
  const renderZootec = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.peso} kg</Text>
      <Text>{new Date(item.dt_registro).toLocaleDateString()}</Text>
      <Text>Condição: {item.condicao_corporal}</Text>
      <Text>Porte: {item.porte_corporal}</Text>
      <Text>Pelagem: {item.cor_pelagem}</Text>
      <Text>Pesagem: {item.tipo_pesagem}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedZootec(item);       // guarda o item que será excluído
          setConfirmDeleteZootecVisible(true); // abre o modal
        }}
      >
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSanitario = ({ item }: any) => {
      console.log("Sanitário item:", item);
    return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.doenca}</Text>
      <Text>{new Date(item.dt_aplicacao).toLocaleDateString()}</Text>
      <Text>Medicação: {item.medicacao?.medicacao}</Text>
      <Text>Descrição: {item.medicacao?.descricao}</Text>
      <Text>Dosagem: {item.dosagem} {item.unidade_medida}</Text>
      <Text>Retorno: {item.necessita_retorno ? 'Sim' : 'Não'}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedSanitario(item);       // guarda o item que será excluído
          setConfirmDeleteSanitarioVisible(true); // abre o modal
        }}
      >
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
  }
  // paginação
  const getPaginatedData = () => {
    if (!detalhes) return [];
    const data = tab === 'zootec' ? detalhes.dadosZootecnicos : detalhes.dadosSanitarios;
    return data.slice(0, page * PAGE_SIZE);
  };

  const loadMore = () => {
    if (!detalhes) return;
    const total = tab === 'zootec' ? detalhes.dadosZootecnicos.length : detalhes.dadosSanitarios.length;
    if (page * PAGE_SIZE < total) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message='Carregando dados do Bufalo...'/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.header1Text}>Prontuário: {animal.nome}</Text>
      </View>

      <MainLayout>
        {/* Informações Básicas */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          <Text>Brinco: {detalhes.brinco}</Text>
          <Text>Raça: {detalhes.racaNome ?? 'Sem raça'}</Text>
          <Text>Sexo: {detalhes.sexo === "F" ? "Fêmea" : "Macho"}</Text>
          <Text>Status: {detalhes.status ? 'Ativo' : 'Inativo'}</Text>
          {!detalhes.status && <Text>Motivo inativo: {detalhes.motivo_inativo}</Text>}
          <Text>Pai: {detalhes.paiNome}</Text>
          <Text>Mãe: {detalhes.maeNome}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === 'zootec' && styles.activeTab]}
            onPress={() => { setTab('zootec'); setPage(1); }}
          >
            <Text style={[styles.tabText, tab === 'zootec' && styles.activeTabText]}>
              Histórico Zootécnico
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'sanitario' && styles.activeTab]}
            onPress={() => { setTab('sanitario'); setPage(1); }}
          >
            <Text style={[styles.tabText, tab === 'sanitario' && styles.activeTabText]}>
              Histórico Sanitário
            </Text>
          </TouchableOpacity>
        </View>

        {/* FlatList */}
        <FlatList
          data={getPaginatedData()}
          keyExtractor={(item, i) => i.toString()}
          renderItem={tab === 'zootec' ? renderZootec : renderSanitario}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            (page * PAGE_SIZE < (tab === 'zootec' ? detalhes.dadosZootecnicos.length : detalhes.dadosSanitarios.length)) &&
            <ActivityIndicator style={{ margin: 10 }} />
          }
        />

        {/* Botão flutuante */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
        </TouchableOpacity>
      </MainLayout>


    <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
      {tab === "zootec" ? (
        <FormZootecnico
          onSubmit={async (data) => {
            try {
              await zootecnicoService.add(animal.id, data);
              await fetchAllData(); // recarregar lista
            } catch (err) {
              console.error("Erro ao salvar zootécnico:", err);
            } finally {
              setModalVisible(false);
            }
          }}
          onClose={() => setModalVisible(false)}
        />
      ) : (
        <FormSanitario
          idBufalo={animal.id}
          onSubmit={async (data) => {
            try {
              await sanitarioService.add(data);
              await fetchAllData(); // recarregar lista
            } catch (err) {
              console.error("Erro ao salvar sanitário:", err);
            } finally {
              setModalVisible(false);
            }
          }}
          onClose={() => setModalVisible(false)}
        />
      )}
    </Modal>

    <ConfirmModal
      visible={confirmDeleteZootecVisible}
      message="Deseja realmente excluir o registro zootécnico?"
      onCancel={() => setConfirmDeleteZootecVisible(false)}
      onConfirm={async () => {
        try {
          await zootecnicoService.delete(Number(selectedZootec.id_zootec));
          setDetalhes((prev: any) => ({
            ...prev,
            dadosZootecnicos: prev.dadosZootecnicos.filter(
              (              h: { id_zootec: any; }) => h.id_zootec !== selectedZootec.id_zootec
            ),
          }));
        } catch (err) {
          console.error("Erro ao excluir:", err);
        } finally {
          setConfirmDeleteZootecVisible(false);
          setSelectedZootec(null);
        }
      }}
    />

    <ConfirmModal
      visible={confirmDeleteSanitarioVisible}
      message="Deseja realmente excluir o registro sanitário?"
      onCancel={() => setConfirmDeleteSanitarioVisible(false)}
      onConfirm={async () => {
        try {
          console.log("ID Sanitário para exclusão:", selectedSanitario.id_sanit);
          await sanitarioService.delete(Number(selectedSanitario.id_sanit));
          setDetalhes((prev: any) => ({
            ...prev,
            dadosSanitarios: prev.dadosSanitarios.filter(
              (              h: { id_sanit: any; }) => h.id_sanit !== selectedSanitario.id_sanit
            ),
          }));
        } catch (err) {
          console.error("Erro ao excluir:", err);
        } finally {
          setConfirmDeleteSanitarioVisible(false);
          setSelectedSanitario(null);
        }
      }}
    />


    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    height: 80, 
    backgroundColor: colors.yellow.base, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  header1Text: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginTop: 30, 
    color: colors.brown.base 
  },
  container: { 
    flex: 1 
  },
  content: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    margin: 12, 
    borderColor: colors.gray.disabled 
  },
  sectionTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8 
  },
  tabContainer: { 
    flexDirection: "row", 
    marginHorizontal: 12, 
    borderRadius: 12, 
    overflow: "hidden", 
    marginBottom: 8 
  },
  tab: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: "#eee", 
    alignItems: "center" 
  },
  activeTab: { 
    backgroundColor: colors.yellow.base 
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333" 
  },
  activeTabText: { 
    color: "#fff" 
  },
  card: { 
    backgroundColor: "#fff", 
    marginHorizontal: 12, 
    marginVertical: 6, 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.gray.disabled 
  },
  cardTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 4 
  },
  fab: { 
    position: "absolute", 
    bottom: 20, 
    right: 20, 
    backgroundColor: "green", 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: "center", 
    alignItems: "center", 
    elevation: 4 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});