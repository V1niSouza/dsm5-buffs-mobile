import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Pressable, Modal, FlatList, ActivityIndicator} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg';
import { usePropriedade } from '../context/PropriedadeContext';
import bufaloService from '../services/bufaloService';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormBufalo } from '../components/FormBufalo';
import { Modal as CustomModal  } from '../components/Modal';
import Button from '../components/Button';
import { CardBufalo } from '../components/CardBufaloRebanho';
import AgroCore from '../icons/agroCore';
import FiltroRebanho from '../components/SearchBar';

type Tag = { id?: string; [key: string]: any };

type Animal = {
  id: string;
  id_bufalo: string;
  nome: string;
  brinco: string;
  status: boolean;
  sexo: "F" | "M";
  maturidade?: string;
  raca?: string;
};

type RootStackParamList = {
  MainTab: undefined;
  AnimalDetail: { id: string };
};

type Filtros = {
  brinco?: string;
  sexo?: "M" | "F";
  nivel_maturidade?: "B" | "N" | "V" | "T";
  status?: boolean;
  id_raca?: string;
};

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


export const RebanhoScreen = () => {
  const { wp, hp } = useDimensions();
  const { propriedadeSelecionada } = usePropriedade();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTags, setScannedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState<Filtros>({});

  const tagList: string[] = [];
  const fetchBufalosFiltrados = async (filtrosAplicados: any = {}, page = 1) => {
    try {
      if (!propriedadeSelecionada) return;
      setLoading(true);

      const { bufalos, meta } = await bufaloService.filtrarBufalos(
        propriedadeSelecionada,
        filtrosAplicados,
        page
      );
      const animaisFormatados = bufalos.map((b: any) => ({
        id: b.id_bufalo,
        status: b.status,
        brinco: b.brinco,
        nome: b.nome,
        raca: b.raca?.nome ?? "Sem raça definida",
        sexo: b.sexo,
        maturidade: b.nivel_maturidade,
      }));
      setAnimais(animaisFormatados);
      setAnimaisFiltrados(animaisFormatados);
      setPaginaAtual(meta.page);
      setTotalPaginas(meta.totalPages);
    } catch (err) {
      console.error("Erro ao buscar búfalos:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBufalosFiltrados(paginaAtual);
    setRefreshing(false);
  };

  const handleReadTag = async () => {
    try {
      setIsScanning(true);
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.NfcA);

      const tag = await NfcManager.getTag();
      if (!tag) return;

      const tagId = tag.id?.toUpperCase() || '';
      if (tagId && !tagList.includes(tagId)) {
        tagList.push(tagId);
        setScannedTags([...tagList]); 
      }

      console.log("Tag lida:", tagId);

    } catch (err) {
      console.warn("Erro ao ler a tag:", err);
    } finally {
      setIsScanning(false);
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const handleCloseScanner = () => setShowScannerModal(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      if (propriedadeSelecionada) {
        await fetchBufalosFiltrados();
      }
      setLoading(false);
    };
    loadInitialData();
  }, [propriedadeSelecionada]);


  useEffect(() => {
    fetchBufalosFiltrados(filtros, 1); 
  }, [filtros]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AgroCore width={200} height={200} />
        <Text>Carregando animais...</Text>
        <ActivityIndicator size="large" color={colors.yellow.static} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal de Scanner */}

      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Rebanho</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Plus width={15} height={15} style={{ margin: 6 }}/>
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView>
          <View style={styles.containetSearch}>
            <FiltroRebanho onFiltrar={(f) => {
                setFiltros(f);
                fetchBufalosFiltrados(f);
              }}
              filtros={filtros}  />
          </View>
          <FlatList
            data={animaisFiltrados}
            keyExtractor={(item, index) => String(item.id || item.id_bufalo || index)}
            renderItem={({ item }) => (
              <CardBufalo
                nome={item.nome}
                brinco={item.brinco}
                status={item.status}
                sexo={item.sexo}
                maturidade={item.maturidade || "Desconhecida"}
                categoria={item.raca}
                onPress={() => navigation.navigate("AnimalDetail", { id: item.id })}
              />
            )}
            nestedScrollEnabled={true}
            scrollEnabled={false} 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: colors.gray.disabled,
              marginBottom: 50,
            }}
            ListFooterComponent={
              <View style={styles.pagination}>
                <Button
                  title="Anterior"
                  onPress={() => {
                    if (paginaAtual > 1) fetchBufalosFiltrados(filtros, paginaAtual - 1);
                  }}
                  disabled={paginaAtual === 1}
                />
                <Text style={styles.pageInfo}>
                  Página {paginaAtual} de {totalPaginas}
                </Text>
                <Button
                  title="Próxima"
                  onPress={() => {
                    if (paginaAtual < totalPaginas) fetchBufalosFiltrados(filtros, paginaAtual + 1);
                  }}
                  disabled={paginaAtual === totalPaginas}
                />
              </View>
            }
          />
        </ScrollView>
      </MainLayout>
      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <FormBufalo
          onSuccess={() => {
            fetchBufalosFiltrados(); 
            setModalVisible(false); 
          }}
        />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1
   },
  containetSearch: { 
    flex: 1, 
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white.base,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    shadowColor: colors.black.base,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    zIndex: 1,
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
    borderRadius: 50 
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
  centeredView: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalView: { 
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 35, 
    alignItems: 'center', 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: colors.brown.base 
  },
  modalSubtitle: { 
    fontSize: 16, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  statusText: { 
    fontSize: 16, 
    fontStyle: 'italic',
    marginBottom: 15 
  },
  modalButton: { 
    borderRadius: 10, 
    padding: 10, 
    elevation: 2, 
    marginHorizontal: 5,
    marginVertical: 5 
  },
  buttonStart: { 
    backgroundColor: colors.green.active 
  },
  buttonClose: { 
    backgroundColor: colors.gray.base, 
    marginTop: 20 
  },
  textStyle: { 
    color: 'white', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  tagListContainer: { 
    width: '100%', 
    maxHeight: 150, 
    borderWidth: 1, 
    borderColor: colors.gray.disabled, 
    borderRadius: 10, 
    padding: 10, 
    marginTop: 15 
  },
  tagListTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: colors.brown.base 
  },
  tagList: { 
    flex: 1
  },
  tagItem: { 
    paddingVertical: 5, 
    borderBottomWidth: 0.5, 
    borderBottomColor: colors.gray.disabled 
  },
  tagText: { 
    fontSize: 14, 
    color: colors.black.base 
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
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
});
