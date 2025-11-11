// RebanhoScreen.tsx (Código Atualizado)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, FlatList, ActivityIndicator} from 'react-native';
// ❌ REMOVER: import NfcManager, { NfcTech } from 'react-native-nfc-manager';
// ❌ REMOVER: import * as RNFCM from 'react-native-nfc-manager'; 

// 🔑 ADICIONAR: Importação dos hooks de rota para receber dados
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg';
import { usePropriedade } from '../context/PropriedadeContext';
import bufaloService from '../services/bufaloService';
import { FormBufalo } from '../components/FormBufalo';
import { Modal as CustomModal  } from '../components/Modal';
import Button from '../components/Button';
import { CardBufalo } from '../components/CardBufaloRebanho';
import AgroCore from '../icons/agroCore';
import FiltroRebanho from '../components/SearchBar';

// type Tag = { id?: string; [key: string]: any }; // ❌ REMOVER

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

type Filtros = {
  brinco?: string;
  sexo?: "M" | "F";
  nivel_maturidade?: "B" | "N" | "V" | "T";
  status?: boolean;
  id_raca?: string;
};

// 🔑 ATUALIZAÇÃO: Define a rota para receber o parâmetro 'lidas'
type RootStackParamList = {
  MainTab: undefined;
  AnimalDetail: { id: string };
  RebanhoScreen: { lidas?: string[] }; 
  NfcScannerScreen: undefined; // Adiciona a nova tela de scanner
};

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
// 🔑 NOVO HOOK: Para acessar os parâmetros retornados da NfcScannerScreen
const route = useRoute<RouteProp<RootStackParamList, 'RebanhoScreen'>>();


export const RebanhoScreen = () => {
  const { wp, hp } = useDimensions();
  const { propriedadeSelecionada } = usePropriedade();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // ❌ REMOVER ESTADOS NFC ANTIGOS
  // const [showScannerModal, setShowScannerModal] = useState(false);
  // const [isScanning, setIsScanning] = useState(false);
  // const [lidas, setLidas] = useState<string[]>([]);
  // const isScanningRef = useRef(false);

  // 🔑 NOVO ESTADO: Armazena tags recebidas da NfcScannerScreen
  const [tagsRecebidas, setTagsRecebidas] = useState<string[]>([]); 

  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState<Filtros>({});

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

// ❌ REMOVER FUNÇÕES NFC ANTIGAS: pararScanner, lerProximaTag, iniciarCicloLeitura
// -------------------------------------------------------------
// FUNÇÕES NFC ANTIGAS (REMOVIDAS)
// -------------------------------------------------------------

  // const handleCloseScanner = () => pararScanner(); // ❌ REMOVER

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


  // 🔑 NOVO EFEITO: Captura e processa as tags lidas ao retornar da NfcScannerScreen
  useEffect(() => {
    if (route.params?.lidas && route.params.lidas.length > 0) {
        setTagsRecebidas(route.params.lidas);
        
        // 🚨 LÓGICA DE PROCESSAMENTO AQUI:
        console.log("Tags lidas recebidas. Processando busca de animais...");
        // Exemplo: fetchBufalosPorTags(route.params.lidas);
        
        // Limpa o parâmetro da rota para evitar que o useEffect seja disparado novamente
        navigation.setParams({ lidas: undefined });
    }
  }, [route.params?.lidas]); 
  
  // 🔑 NOVA FUNÇÃO: Navega para a tela de scanner
  const iniciarScanner = () => {
    navigation.navigate('NfcScannerScreen');
  };
  
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
          
          {/* Exibe tags lidas para debug/confirmação */}
          {tagsRecebidas.length > 0 && (
             <View style={styles.tagConfirmationBox}>
                 <Text style={styles.tagConfirmationText}>✅ {tagsRecebidas.length} Tags lidas e prontas para processamento.</Text>
                 {/* <Text>{tagsRecebidas.join(', ')}</Text> */}
             </View>
          )}

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
            contentContainerStyle={styles.contentContainer}
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
          {/* 🔑 BOTÃO AGORA CHAMA A NAVEGAÇÃO PARA A NOVA TELA */}
          <TouchableOpacity onPress={iniciarScanner} style={styles.button}>
            <Scanner width={18} height={18} style={{ margin: 6 }} />
          </TouchableOpacity>
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

{/* ❌ REMOVER O MODAL NFC INTEIRO */}

    </View>
  );
};

const styles = StyleSheet.create({
  // ... (Estilos existentes)
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
  contentContainer: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    paddingVertical: 16, 
    paddingHorizontal: 10, 
    borderWidth: 1, 
    marginBottom: 50, 
    borderColor: colors.gray.disabled 
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
  tagConfirmationBox: {
    backgroundColor: colors.green.active + '10', // Um verde suave
    borderColor: colors.green.active,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tagConfirmationText: {
    fontWeight: 'bold',
    color: colors.green.active,
  }
});

function alert(arg0: string) {
  // Mantido para evitar erro de referência, mas a nova tela usa setStatusText
  // Em uma aplicação real, você deve implementar o Alert real do React Native aqui.
  console.warn(arg0);
}