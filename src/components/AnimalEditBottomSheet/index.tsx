import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ToastAndroid,
    Alert,
    ActivityIndicator,
    Animated,
    Easing,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import bufaloService from "../../services/bufaloService";
import { usePropriedade } from "../../context/PropriedadeContext";
import YellowButton from "../Button";
import { colors } from "../../styles/colors";
import dayjs from "dayjs";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { formatarDataBR } from "../../utils/date";
import SelectBottomSheet from "../SelectBottomSheet";
import { NfcTextInput } from "../NfcTextInput";
import { useTranslation } from "react-i18next";



// ==========================================================
// --- INTERFACES (Inalteradas) ---
// ==========================================================
interface AnimalInfoItem {
    idBufalo: string;
    nome?: string;
    brinco: string;
    microchip?: string;
    dtNascimento?: string;
    sexo: 'F' | 'M';
    nivelMaturidade?: 'B' | 'N' | 'V' | 'T';
    racaNome?: string;
    idRaca?: string;
    paiNome?: string;
    maeNome?: string;
}

interface AnimalEditBottomSheetProps {
    item: AnimalInfoItem;
    onEditSave: (idBufalo: string, data: any) => Promise<void>;
    onClose: () => void;
}


export const AnimalEditBottomSheet: React.FC<AnimalEditBottomSheetProps> = ({ item, onEditSave, onClose }) => {

    const normalizeParentName = (name: string | undefined): string => {
        if (!name) return "";
        
        const unknownIdentifiers = ["DESCONHECIDO", "N/A", ""]; 
        const normalizedName = name.toUpperCase().trim();
        
        if (unknownIdentifiers.includes(normalizedName)) {
            return "";
        }
        
        return name;
    };

    const { propriedadeSelecionada } = usePropriedade();
    const { t } = useTranslation("rebanho");
    
    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "70%"], []);
    useEffect(() => {
        sheetRef.current?.present();
    }, []);
    const [nome, setNome] = useState(item.nome || "");
    const [brinco, setBrinco] = useState(item.brinco || "");
    const [microchip, setMicrochip] = useState(item.microchip || "");
    const [nivelMaturidade, setNivelMaturidade] = useState(item.nivelMaturidade || "");
    const [idRaca, setIdRaca] = useState(item.idRaca || "");
    
    
    // ESTADO ORIGINAL (com o potencial erro de tipagem no brincoMae)
    const [brincoPai, setBrincoPai] = useState(normalizeParentName(item.paiNome)); 
    const [brincoMae, setBrincoMae] = useState(normalizeParentName(item.maeNome)); 
    
    const [racas, setRacas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Adicionado para o botão

    const [openMaturidade, setOpenMaturidade] = useState(false);
    const [openRaca, setOpenRaca] = useState(false);

    const zIndexMaturidade = openMaturidade ? 4000 : 1000;
    const zIndexRaca = openRaca ? 3000 : 900;
    
    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        const fetchRacas = async () => {
            try {
                const racasApi = await bufaloService.getRacas();
                const mappedRacas = racasApi.map((r: any) => ({
                    label: r.nome,
                    value: r.idRaca ?? r.id,
                }));
                setRacas(mappedRacas);
            } catch (err) {
                console.error("Erro ao buscar raças:", err);
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
            Alert.alert(isError ? t("form.alert.error") : t("form.alert.success"), message);
        }
    };
    

    const handleSave = async () => {
        if (isSaving) return;

        if (!propriedadeSelecionada) {
            showToast(t("edit.toast.noProperty"), true);
            return;
        }
        
        // Validação Mínima
        if (!nome || !brinco || !nivelMaturidade) {
            showToast(t("edit.toast.missingFields"), true);
            return;
        }

        try {
            setIsSaving(true); // Usa isSaving para o botão

            let idPai: number | null = null;
            
            // Validação de Pai (Macho)
            if (brincoPai) {
                const paiEncontrado = await bufaloService.getBufaloByBrincoAndSexo(
                    propriedadeSelecionada, brincoPai, "M"
                );
                if (!paiEncontrado) {
                    showToast(t("edit.toast.fatherNotFound", { brinco: brincoPai }), true);
                    setIsSaving(false);
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
                    showToast(t("edit.toast.motherNotFound", { brinco: brincoMae }), true);
                    setIsSaving(false);
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
            await onEditSave(item.idBufalo, payload); 
            showToast(t("edit.toast.success"));
            
        } catch (err) {
            console.error("Erro ao atualizar búfalo:", err);
            showToast(t("edit.toast.saveError"), true);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading && racas.length === 0) { 
        return (
            <BottomSheetModal
                ref={sheetRef}
                index={0}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                onChange={handleSheetChange}
                backgroundStyle={styles.sheetBackground}
                handleIndicatorStyle={styles.handleIndicator}
                backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="none" />}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.brand.primary} />
                    <Text style={{ marginTop: 10, color: colors.text.secondary }}>{t("edit.loading")}</Text>
                </View>
            </BottomSheetModal>
        );
    }


    return (
        <BottomSheetModal
            ref={sheetRef}
            index={0}
            name="EditAnimalModal"
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={handleSheetChange}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            stackBehavior="push"
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    pressBehavior="none"
                    enableTouchThrough={true}
                />
            )}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t("edit.title", { brinco: item.brinco })}</Text>
                </View>
                
                {/* --- Dados Básicos --- */}
                <Text style={styles.sectionTitle}>{t("edit.basicData")}</Text>
                <View style={styles.listContainer}>
                    <Text style={styles.label}>{t("edit.name")}</Text>
                    <TextInput
                        style={styles.inputBase}
                        value={nome}
                        onChangeText={setNome}
                        placeholder={t("edit.namePlaceholder")}/>
                    <Text style={styles.label}>{t("edit.tag")}</Text>
                    <TextInput
                        style={styles.inputBase}
                        value={brinco}
                        onChangeText={setBrinco}
                        placeholder={t("edit.tagPlaceholder")}/>
                    <Text style={styles.label}>{t("edit.microchip")}</Text>
                    <NfcTextInput
                        mode="microchip"
                        onResult={setMicrochip}
                        value={microchip}
                        onChangeText={setMicrochip}
                        placeholder={t("edit.microchipPlaceholder")}
                    />
                </View>
                
                {/* --- Características --- */}
                <Text style={styles.sectionTitle}>{t("edit.characteristics")}</Text>
                <View style={styles.listContainer}>
                    
                    {/* Campo Sexo (Não Editável) */}
                    <Text style={styles.label}>{t("edit.sex")}</Text>
                    <TextInput
                        style={[styles.inputBase, styles.inputDisabled]}
                        value={item.sexo === 'F' ? t("edit.female") : t("edit.male")}
                        onChangeText={() => {}}
                        editable={false}
                        pointerEvents="none"
                        placeholder={t("edit.sexPlaceholder")}/>
  
                    {/* Data de Nascimento (Não Editável) */}
                    <Text style={styles.label}>{t("edit.birthDate")}</Text>
                    <TextInput
                        style={[styles.inputBase, styles.inputDisabled]}
                        value={item.dtNascimento ? formatarDataBR(item.dtNascimento) : t("edit.notProvided")}
                        onChangeText={() => {}}
                        editable={false}
                        placeholder={t("edit.birthDatePlaceholder")}/>

                    {/* Dropdown Maturidade */}
                    <View style={{ zIndex: zIndexMaturidade, marginBottom: 12 }}>
                        <Text style={styles.dropdownLabel}>{t("edit.maturity")}</Text>
                        <SelectBottomSheet
                            items={[
                                { label: t("maturity.B"), value: "B" },
                                { label: t("maturity.N"), value: "N" },
                                { label: t("maturity.V"), value: "V" },
                                { label: t("maturity.T"), value: "T" },
                            ]}
                            value={nivelMaturidade}
                            onChange={(value) => setNivelMaturidade(value)}
                            title={t("edit.selectMaturity")}
                            placeholder={t("edit.selectPlaceholder")}/>
                    </View>
                    
                    <View style={{ zIndex: zIndexRaca, marginBottom: 12 }}>
                        <Text style={styles.dropdownLabel}>{t("edit.breed")}</Text>
                        <SelectBottomSheet
                        items={racas}
                        value={idRaca}
                        onChange={(value) => setIdRaca(value)}
                        title={t("edit.selectBreed")}
                        placeholder={t("edit.breedPlaceholder")}
                        />
                    </View>
                </View>

                {/* --- Parentesco --- */}
                <Text style={styles.sectionTitle}>{t("edit.parentage")}</Text>
                <View style={styles.listContainer}>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>{t("edit.fatherTag")}</Text>
                            <NfcTextInput
                                mode="brinco"
                                sexo="M"
                                onResult={setBrincoPai}
                                propriedadeId={propriedadeSelecionada ?? undefined}
                                value={brincoPai}
                                onChangeText={setBrincoPai}
                                placeholder={t("edit.tagOrRfid")}
                                containerStyle={{ marginBottom: 0 }}
                            />
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>{t("edit.motherTag")}</Text>
                            <NfcTextInput
                                mode="brinco"
                                sexo="F"
                                onResult={setBrincoMae}
                                propriedadeId={propriedadeSelecionada ?? undefined}
                                value={brincoMae}
                                onChangeText={setBrincoMae}
                                placeholder={t("edit.tagOrRfid")}
                                containerStyle={{ marginBottom: 0 }}
                            />
                        </View>
                    </View>
                </View>

                {/* Footer (Botão de ação) */}
                <View style={styles.footer}>
                    <YellowButton 
                        title={isSaving ? t("edit.submitting") : t("edit.submit")} 
                        onPress={handleSave} 
                        disabled={isSaving}
                    />
                </View>

            </BottomSheetScrollView>
        </BottomSheetModal>
    );
};

// ==========================================================
// --- ESTILOS (UNIFICADOS E ADAPTADOS) ---
// ==========================================================

const styles = StyleSheet.create({

    halfInput: {
        flex: 1,
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 0, // O espaçamento está dentro dos Floating Labels (inputContainer)
        gap: 16,
    },
    // Estilos do BottomSheet
    sheetBackground: { backgroundColor: colors.bg.sheet, borderRadius: 24 },
    handleIndicator: { backgroundColor: colors.border.light, height: 4, width: 36 },

    scrollContainer: { 
        paddingBottom: 40,
        backgroundColor: colors.bg.sheet,
    },
    
    // Container principal
    container: {
        paddingBottom: 32,
        backgroundColor: colors.bg.sheet,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700",
        color: colors.text.heading,
    },
    sectionTitle: {
        fontWeight: "600",
        fontSize: 16,
        color: colors.text.heading,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
        paddingBottom: 4,
    },
    // Estilo base do input, usado pelo Floating Label
    inputBase: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.border.default,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: colors.text.heading,
        backgroundColor: colors.bg.card,
        height: 50, 
    },

    // --- Estilos da Lista e Itens ---
    listContainer: {
        backgroundColor: colors.bg.card,
        borderRadius: 16,
        marginHorizontal: 10,
        padding: 16,
        overflow: "visible", 
        zIndex: 100, 
        marginBottom: 8,
    },
    listLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4,
    },
    
    // --- Estilos do Dropdown ---
    dropdownStyle: {
        borderColor: colors.border.default,
        backgroundColor: colors.bg.card,
        height: 50,
        marginBottom: 4, 
    },
    dropdownContainerStyle: { 
        borderColor: colors.border.default,
    },

    // --- Footer ---
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 16,
        borderTopWidth: 1,
        borderColor: colors.border.default,
        marginTop: 16,
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: "600",
        marginBottom: 4,
    },
    dropdownLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: "600",
        marginBottom: 4,
    },
    inputDisabled: {
        backgroundColor: colors.bg.subtle,
        color: colors.text.muted,
    },
});