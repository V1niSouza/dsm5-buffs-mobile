import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, Pressable, 
  FlatList
} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableAnimais, { Animal } from '../components/TableRebanho';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import Scanner from '../../assets/images/qr-scan.svg';
import { usePropriedade } from '../context/PropriedadeContext';
import bufaloService from '../services/bufaloService';

type Tag = { id?: string; [key: string]: any };

export const RebanhoScreen = () => {
  const { wp, hp } = useDimensions();
  const { propriedadeSelecionada } = usePropriedade();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTags, setScannedTags] = useState<string[]>([]);
  const tagList: string[] = []; // lista local que vai acumular
  // Buscar búfalos
  const fetchBufalos = async () => {
    try {
      const { raw } = await bufaloService.getBufalos();
      const filtrados = raw
        .filter((b: any) => b.id_propriedade === propriedadeSelecionada)
        .map((b: any) => ({
          id: b.id_bufalo,
          status: b.status,
          brinco: b.brinco,
          nome: b.nome,
          raca: b.racaNome,
          sexo: b.sexo === 'M' ? 'Macho' : 'Femêa'
        }));
      setAnimais(filtrados);
      setAnimaisFiltrados(filtrados);
    } catch (err) {
      console.error("Erro ao buscar búfalos:", err);
    }
  };

  useEffect(() => {
    if (propriedadeSelecionada) fetchBufalos();
  }, [propriedadeSelecionada]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBufalos();
    setRefreshing(false);
  };

const handleReadTag = async () => {
  try {
    setIsScanning(true);
    await NfcManager.start();
    await NfcManager.requestTechnology(NfcTech.NfcA);

    const tag = await NfcManager.getTag();
    if (!tag) return;

    // Convertendo ID corretamente
    const tagId = tag.id?.toUpperCase() || '';
    if (tagId && !tagList.includes(tagId)) {
      tagList.push(tagId);
      setScannedTags([...tagList]); // atualiza estado para renderizar
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

  return (
    <View style={styles.container}>
      {/* Modal de Scanner */}
      <Modal
        animationType="slide"
        transparent
        visible={showScannerModal}
        onRequestClose={handleCloseScanner}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Leitor de Tags</Text>
            <Text style={styles.modalSubtitle}>
              Clique em "Ler Tag" e aproxime o celular da tag.
            </Text>

            <Text style={styles.statusText}>
              Status: {isScanning ? "Escaneando..." : "Pronto para ler"}
            </Text>

            <Pressable
              style={[styles.modalButton, styles.buttonStart]}
              onPress={handleReadTag}
              disabled={isScanning}
            >
              <Text style={styles.textStyle}>Ler Tag</Text>
            </Pressable>

            {scannedTags.length > 0 && (
              <View style={styles.tagListContainer}>
                <Text style={styles.tagListTitle}>Tags Lidas:</Text>
                  <FlatList
                    data={scannedTags}
                    keyExtractor={(item) => item}
                    style={styles.tagList}
                    renderItem={({ item }) => (
                      <View style={styles.tagItem}>
                        <Text style={styles.tagText}>{item}</Text>
                      </View>
                    )}
                  />
              </View>
            )}

            <Pressable
              style={[styles.modalButton, styles.buttonClose]}
              onPress={handleCloseScanner}
            >
              <Text style={styles.textStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Rebanho</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowScannerModal(true)} style={styles.button}>
            <Scanner width={18} height={18} style={{ margin: 4 }}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Abrir modal")} style={styles.button}>
            <Plus width={15} height={15} style={{ margin: 6 }}/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo principal */}
      <MainLayout>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.content}>
            <SearchBar animais={animais} onFiltered={setAnimaisFiltrados}/>
            <TableAnimais
              data={animaisFiltrados}
              onVerMais={(animal: Animal) => console.log('Animal:', animal)}
            />
          </View>
        </ScrollView>
      </MainLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 80, backgroundColor: colors.yellow.base, justifyContent: 'center', paddingLeft: 16, borderBottomWidth: 0.5, borderColor: colors.black.base },
  header1Text: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 30, color: colors.brown.base },
  headerButtons: { marginTop: 25, flexDirection: "row", position: "absolute", right: 20, gap: 20 },
  button: { backgroundColor: colors.yellow.dark, borderRadius: 50 },
  content: { backgroundColor: "#fff", borderRadius: 12, paddingTop: 16, paddingBottom: 16, paddingHorizontal: 10, borderWidth: 1, marginBottom: 50, borderColor: colors.gray.disabled },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', width: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: colors.brown.base },
  modalSubtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  statusText: { fontSize: 16, fontStyle: 'italic', marginBottom: 15 },
  modalButton: { borderRadius: 10, padding: 10, elevation: 2, marginHorizontal: 5, marginVertical: 5 },
  buttonStart: { backgroundColor: colors.green.active },
  buttonClose: { backgroundColor: colors.gray.base, marginTop: 20 },
  textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  tagListContainer: { width: '100%', maxHeight: 150, borderWidth: 1, borderColor: colors.gray.disabled, borderRadius: 10, padding: 10, marginTop: 15 },
  tagListTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: colors.brown.base },
  tagList: { flex: 1 },
  tagItem: { paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: colors.gray.disabled },
  tagText: { fontSize: 14, color: colors.black.base },
});
