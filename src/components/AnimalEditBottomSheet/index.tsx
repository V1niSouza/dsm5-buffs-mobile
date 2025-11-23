import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ToastAndroid, Alert, ActivityIndicator } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import bufaloService from "../../services/bufaloService";
import { usePropriedade } from "../../context/PropriedadeContext";
import YellowButton from "../Button"; 
import { colors } from "../../styles/colors";
import { DatePickerModal } from "../DatePickerModal"; 
import dayjs from "dayjs";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";

// Assumindo a estrutura de dados que a tela AnimalDetail está passando
interface AnimalInfoItem {
    id_bufalo: number;
    nome?: string;
    brinco: string;
    microchip?: string;
    dt_nascimento?: string;
    sexo: 'F' | 'M';
    nivel_maturidade?: 'B' | 'N' | 'V' | 'T';
    racaNome?: string;
    id_raca?: number;
    paiNome?: string;
    maeNome?: string;
}

interface AnimalEditBottomSheetProps {
    item: AnimalInfoItem;
    onEditSave: (id_bufalo: number, data: any) => Promise<void>; 
    onClose: () => void;
}

export const AnimalEditBottomSheet: React.FC<AnimalEditBottomSheetProps> = ({ item, onEditSave, onClose }) => {

    const normalizeParentName = (name: string | undefined): string => {
        if (!name) return ""; // Se for nulo ou undefined, retorna vazio
        
        const unknownIdentifiers = ["DESCONHECIDO", "N/A", ""]; // Adicione aqui outras strings que representam 'desconhecido'
        const normalizedName = name.toUpperCase().trim();
        
        if (unknownIdentifiers.includes(normalizedName)) {
            return "";
        }
        
        return name; // Retorna o nome original (o brinco)
    };

    // Acesso ao contexto da propriedade
    const { propriedadeSelecionada } = usePropriedade(); 
    
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%", "95%"], []);
    
    // Estados do Formulário (Pré-preenchidos com os dados do item)
    const [nome, setNome] = useState(item.nome || "");
    const [brinco, setBrinco] = useState(item.brinco || "");
    const [microchip, setMicrochip] = useState(item.microchip || "");
    const [nivelMaturidade, setNivelMaturidade] = useState(item.nivel_maturidade || "");
    const [idRaca, setIdRaca] = useState<number | null>(item.id_raca || null);
    
    // Parentesco: Usamos os nomes/brincos atuais para pré-preencher
    const [brincoPai, setBrincoPai] = useState(normalizeParentName(item.paiNome)); 
    const [brincoMae, setBrincoMae] = useState(normalizeParentName(item.paiNome)); 

    const [racas, setRacas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // DropDownPicker States
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [openSexo, setOpenSexo] = useState(false);
    const [openMaturidade, setOpenMaturidade] = useState(false);
    const [openRaca, setOpenRaca] = useState(false);

    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        const fetchRacas = async () => {
            try {
                const racasApi = await bufaloService.getRacas();
                setRacas(racasApi);
            } catch (err) {
                console.error("Erro ao buscar raças:", err);
                Alert.alert("Erro", "Não foi possível carregar a lista de raças.");
            } finally {
                setLoading(false);
            }
        };
        fetchRacas();
    }, []);

    const showToast = (message: string, isError: boolean = false) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert(isError ? "Erro" : "Sucesso", message);
        }
    };

    const handleSave = async () => {
        if (!propriedadeSelecionada) {
            showToast("ID da Propriedade não encontrado. Não é possível salvar.", true);
            return;
        }
        
        // Validação Mínima
        if (!nome || !brinco || !nivelMaturidade) {
            showToast("Preencha Nome, Brinco e Maturidade.", true);
            return;
        }

        try {
            setLoading(true);

            let idPai: number | null = null;
            
            // Validação de Pai (Macho)
            if (brincoPai) {
                const paiEncontrado = await bufaloService.getBufaloByBrincoAndSexo(
                    propriedadeSelecionada, brincoPai, "M"
                );
                if (!paiEncontrado) {
                    showToast(`Nenhum pai encontrado com brinco '${brincoPai}' (Macho) na propriedade.`, true);
                    setLoading(false);
                    return;
                }
                idPai = paiEncontrado.id || paiEncontrado.id_bufalo;
            }

            let idMae: number | null = null;
            
            // Validação de Mãe (Fêmea)
            if (brincoMae) {
                const maeEncontrada = await bufaloService.getBufaloByBrincoAndSexo(
                    propriedadeSelecionada, brincoMae, "F"
                );
                if (!maeEncontrada) {
                    showToast(`Nenhuma mãe encontrada com brinco '${brincoMae}' (Fêmea) na propriedade.`, true);
                    setLoading(false);
                    return;
                }
                idMae = maeEncontrada.id || maeEncontrada.id_bufalo;
            }

            const payload = {
                nome,
                brinco,
                microchip,
                nivel_maturidade: nivelMaturidade,
                id_raca: idRaca,
                id_pai: idPai,
                id_mae: idMae,
            };
            // Chama a função passada pela tela pai para persistir e recarregar
            await onEditSave(item.id_bufalo, payload); 
            showToast("Informações atualizadas com sucesso!");
            
        } catch (err) {
            console.error("Erro ao atualizar búfalo:", err);
            showToast("Não foi possível salvar as alterações.", true);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading && racas.length === 0) { // Mostra o loader apenas na carga inicial de raças
        return (
            <BottomSheet
                ref={sheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                backgroundStyle={{ backgroundColor: "#F8F7F5", borderRadius: 24 }}
                handleIndicatorStyle={{ backgroundColor: "#D1D5DB", height: 4, width: 36 }}
                backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="none" />}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.yellow.static} />
                    <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
                </View>
            </BottomSheet>
        );
    }


    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            backgroundStyle={{ backgroundColor: "#F8F7F5", borderRadius: 24 }}
            handleIndicatorStyle={{ backgroundColor: "#D1D5DB", height: 4, width: 36 }}
            enablePanDownToClose={true}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    pressBehavior="none"
                />
            )}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.headerTitle}>Editar Animal: {item.brinco}</Text>
                    
                    <Text style={styles.sectionTitle}>Dados Básicos</Text>
                    <TextInput style={styles.inputFull} placeholder="Nome" value={nome} onChangeText={setNome} />
                    <TextInput style={styles.inputFull} placeholder="Brinco" value={brinco} onChangeText={setBrinco} />
                    <TextInput style={styles.inputFull} placeholder="Microchip" value={microchip} onChangeText={setMicrochip} />

                    <Text style={styles.sectionTitle}>Características</Text>
                    <View style={styles.row}>
                        <DropDownPicker
                            open={openMaturidade}
                            setOpen={setOpenMaturidade}
                            value={nivelMaturidade}
                            setValue={setNivelMaturidade}
                            items={[
                                { label: "Bezerro (B)", value: "B" },
                                { label: "Novilha (N)", value: "N" },
                                { label: "Vaca (V)", value: "V" },
                                { label: "Touro (T)", value: "T" },
                            ]}
                            placeholder="Maturidade"
                            containerStyle={{ flex: 1, marginLeft: 8 }}
                            listMode="SCROLLVIEW"
                            zIndex={4000}
                            style={styles.dropdownStyle}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Raça</Text>
                    <DropDownPicker
                        open={openRaca}
                        setOpen={setOpenRaca}
                        value={idRaca}
                        setValue={setIdRaca}
                        items={racas.map(r => ({ label: r.nome, value: r.id_raca }))}
                        placeholder="Selecione Raça"
                        containerStyle={{ marginBottom: 12 }}
                        listMode="SCROLLVIEW"
                        zIndex={3000}
                        style={styles.dropdownStyle}
                    />

                    <Text style={styles.sectionTitle}>Parentesco (Brinco)</Text>
                    <View style={styles.row}>
                        <TextInput style={{ ...styles.inputFull, flex: 1, marginRight: 8 }} placeholder="Brinco do Pai (Macho)" value={brincoPai} onChangeText={setBrincoPai} />
                        <TextInput style={{ ...styles.inputFull, flex: 1, marginLeft: 8 }} placeholder="Brinco da Mãe (Fêmea)" value={brincoMae} onChangeText={setBrincoMae} />
                    </View>

                    <YellowButton title={loading ? "Salvando..." : "Salvar Alterações"} onPress={handleSave} disabled={loading} />
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { 
        paddingBottom: 40,
        backgroundColor: "#F8F7F5",
    },
    container: { 
        padding: 16 
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: { 
        fontWeight: "600", 
        fontSize: 16, 
        marginVertical: 8, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.gray.disabled, 
        paddingBottom: 4,
        color: colors.brown.base
    },
    inputFull: { 
        width: "100%", 
        borderWidth: 1, 
        borderColor: colors.gray.base, 
        borderRadius: 6, 
        padding: 12, 
        marginBottom: 12,
        backgroundColor: colors.white.base,
        justifyContent: 'center',
        minHeight: 48,
    },
    dropdownStyle: {
        borderColor: colors.gray.base,
        backgroundColor: colors.white.base,
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 12 
    },
    placeholderText: {
        color: colors.gray.base,
    },
    dateText: {
        color: colors.black.base,
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
});