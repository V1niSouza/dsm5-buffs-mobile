import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, FlatList, ActivityIndicator} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FloatingAction } from 'react-native-floating-action';

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
import { CadastrarBufaloForm } from '../components/CriaBufaloBottomSheet';

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

type RootStackParamList = {
  MainTab: undefined;
  AnimalDetail: { id: string };
  RebanhoScreen: { lidas?: string[] }; 
  NfcScannerScreen: undefined;
};


export const RebanhoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RebanhoScreen'>>();
  const { wp, hp } = useDimensions();
  const { propriedadeSelecionada } = usePropriedade();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagsRecebidas, setTagsRecebidas] = useState<string[]>([]); 

  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [selectedZootec, setSelectedZootec] = useState<any>(null);

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

  useEffect(() => {
    if (route.params?.lidas && route.params.lidas.length > 0) {
        setTagsRecebidas(route.params.lidas);
        
        console.log("Tags lidas recebidas. Processando busca de animais...");
        navigation.setParams({ lidas: undefined });
    }
  }, [route.params?.lidas]); 
  
  const iniciarScanner = () => {
    navigation.navigate('NfcScannerScreen');
  };

    // Função que será passada para o BottomSheet para salvar os dados
  const handleSaveZootecnico = (data: any) => {
    console.log("Salvando alterações do registro Zootec:", data);
    // 1. Chamar o serviço de atualização
    // Ex: zootecnicoService.update(data);
    // 2. Fechar o BottomSheet
    setSelectedZootec(null); 
    
    // 3. Recarregar a lista (opcional, dependendo da necessidade)
    // fetchData(pageZootec, pageSanit); 
  };

  const actions = [
    {
      text: "Novo Animal",
      icon: <Plus width={24} height={24} fill="black" />, // Use seu SVG aqui
      name: "NovoAnimal",
      position: 1,
      color: colors.yellow.base,
    },
    {
      text: "Scanner NFC",
      icon: <Scanner width={24} height={24} fill="black" />, // Use seu SVG aqui
      name: "NfcScanner",
      position: 2,
      color: colors.yellow.base,
    },
  ];
  const handleActionPress = (name: string | undefined) => {
    if (name === "NovoAnimal") {
      setSelectedZootec(true);
    } else if (name === "NfcScanner") {
      navigation.navigate('NfcScannerScreen');
    }
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

        {!!selectedZootec && (
          <CadastrarBufaloForm 
            key={selectedZootec.id_zootec}
            onClose={() => setSelectedZootec(null)} 
          />
        )}
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
    backgroundColor: colors.green.active, 
    borderColor: colors.green.active,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tagConfirmationText: {
    fontWeight: 'bold',
    color: colors.green.active,
  },
    fabMain: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.yellow.base,
  },

  fabChild: {
    position: 'absolute',
    right: 16,
    backgroundColor: colors.yellow.dark,
  },
});