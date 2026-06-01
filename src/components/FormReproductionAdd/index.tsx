import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform as RNPlatform,
  ToastAndroid,
  Alert,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { usePropriedade } from "../../context/PropriedadeContext";
import bufaloService from "../../services/bufaloService";
import { createReproducao, getMaterialGenetico } from "../../services/reproducaoService";

import { colors } from "../../styles/colors";
import YellowButton from "../Button";
import SelectBottomSheet from "../SelectBottomSheet";
import { NfcTextInput } from "../NfcTextInput";


interface ReproducaoAddBottomSheetProps {
  onSuccess?: () => void; 
  onClose: () => void;
}

export const ReproducaoAddBottomSheet: React.FC<
  ReproducaoAddBottomSheetProps
> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation("reproducao");
  const sheetRef = useRef<BottomSheet>(null);
  const { propriedadeSelecionada } = usePropriedade();
  const { getBufaloByBrincoAndSexo, getBufaloById } = bufaloService; // Assumindo o bufaloService.ts
  // SnapPoints ajustados para acomodar mais campos
  const snapPoints = useMemo(() => ["50%", "70%"], []); 

  // Estado do Formulário
  const [tagBufalo, setTagBufalo] = useState("");
  const [tagBufala, setTagBufala] = useState("");
  const [idDoadora, setIdDoadora] = useState<string | null>(null);
  const [nomeDoadora, setNomeDoadora] = useState<string>('');
  const [matGeneticoSemen, setMatGeneticoSemen] = useState<{ id: string; label: string; idBufalOrigem?: string | null }[]>([]);
  const [matGeneticoOvulo, setMatGeneticoOvulo] = useState<{ id: string; label: string; idBufalOrigem?: string | null }[]>([]);
  const [idSemenSelecionado, setIdSemenSelecionado] = useState<string | null>(null);
  const [idOvuloSelecionado, setIdOvuloSelecionado] = useState<string | null>(null);
  const [tipoInseminacao, setTipoInseminacao] = useState<string | null>(null);
  
  // O status padrão é "Em andamento" (valor enviado à API) — NÃO traduzir.
  const status = "Em andamento";

  const tipoItems = useMemo(() => [
    { label: t("forms.add.types.iatf"), value: "IATF" },
    { label: t("forms.add.types.ia"), value: "IA" },
    { label: t("forms.add.types.te"), value: "TE" },
    { label: t("forms.add.types.natural"), value: "Monta Natural" },
  ], [t]);

  const embrioesFiltrados = useMemo(
    () => matGeneticoOvulo.filter(m => m.idBufalOrigem != null),
    [matGeneticoOvulo],
  );

  useEffect(() => {
    if (!propriedadeSelecionada) return;
    getMaterialGenetico(propriedadeSelecionada).then((mats) => {
      const tipoFiv = (t: string) =>
        t.includes('vulo') || t.includes('embri'); // óvulo / ovulo / embrião / embriao
      const fiv = mats.filter(m => tipoFiv(m.tipo.toLowerCase()));
      // tudo que não é óvulo/embrião vai para sêmen (inclui sem tipo)
      const semen = mats.filter(m => !tipoFiv(m.tipo.toLowerCase()));
      setMatGeneticoSemen(semen);
      setMatGeneticoOvulo(fiv);
    }).catch(() => {});
  }, [propriedadeSelecionada]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );
  
  const showToast = (message: string, isError: boolean = false) => {
    if (RNPlatform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert(isError ? t("forms.shared.alertError") : t("forms.shared.alertSuccess"), message);
    }
  };

  const handleSave = async () => {
    if (!propriedadeSelecionada) {
      return showToast(t("forms.add.toast.noProperty"), true);
    }

    if (!tagBufala || !tipoInseminacao) {
      return showToast(t("forms.add.toast.missingFields"), true);
    }

    if ((tipoInseminacao === "IA" || tipoInseminacao === "IATF") && !idSemenSelecionado) {
      return showToast(t("forms.add.toast.semenRequired", { tipo: tipoInseminacao }), true);
    }
    if (tipoInseminacao === "TE" && (!idOvuloSelecionado || !idDoadora)) {
      return showToast(t("forms.add.toast.embryoRequired"), true);
    }

    let idBufaloMachoUUID: string | null = null;
    let idBufalaFemeaUUID: string | null = null;
    let idSemenUsado = idSemenSelecionado || null;
    let brincoInvalido = null;

    try {
        // --- 1. Búfala receptora ---
        const bufalaFemea = await getBufaloByBrincoAndSexo(propriedadeSelecionada, tagBufala, "F");
        if (!bufalaFemea?.idBufalo) {
            brincoInvalido = tagBufala;
            return showToast(t("forms.add.toast.femaleNotFound", { tag: brincoInvalido }), true);
        }
        idBufalaFemeaUUID = bufalaFemea.idBufalo;

        // --- 2. Macho (Monta Natural) ou Búfala Doadora (TE) ---
        if (tipoInseminacao === "Monta Natural") {
            if (!tagBufalo) return showToast(t("forms.add.toast.maleRequired"), true);
            const bufaloMacho = await getBufaloByBrincoAndSexo(propriedadeSelecionada, tagBufalo, "M");
            if (!bufaloMacho?.idBufalo) {
                brincoInvalido = tagBufalo;
                return showToast(t("forms.add.toast.maleNotFound", { tag: brincoInvalido }), true);
            }
            idBufaloMachoUUID = bufaloMacho.idBufalo;
            idSemenUsado = null;

        }

        // --- 3. Payload ---
        // IA/IATF: idSemen; TE: idSemen (embrião) + idDoadora (búfala doadora); Monta Natural: idBufalo
        const payload = {
            idPropriedade: propriedadeSelecionada,
            idBufalo: idBufaloMachoUUID,
            idBufala: idBufalaFemeaUUID,
            idSemen: tipoInseminacao === 'TE' ? (idOvuloSelecionado ?? null) : idSemenUsado,
            idDoadora: tipoInseminacao === 'TE' ? idDoadora : null,
            tipoInseminacao: tipoInseminacao,
            status: status,
            dtEvento: new Date().toISOString().split("T")[0],
        };
        // ... (restante da chamada da API)
        await createReproducao(payload);
        showToast(t("forms.add.toast.success"));
        onSuccess?.();
        onClose();

    } catch (error: any) {
        const errorMessage = brincoInvalido
            ? t("forms.add.toast.validationFail", { tag: brincoInvalido })
            : error?.message || t("forms.add.toast.error");

        console.error("Erro ao salvar:", error);
        showToast(errorMessage, true);
    }
};


  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close" 
        />
      )}
    >
      <BottomSheetScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("forms.add.title")}</Text>
        </View>

        {/* --- Tipo de Inseminação (primeiro para guiar os campos seguintes) --- */}
        <Text style={styles.sectionTitle}>{t("forms.add.typeSection")}</Text>

        <View style={styles.listContainer}>
          <SelectBottomSheet
            items={tipoItems}
            value={tipoInseminacao}
            onChange={(val: any) => {
              setTipoInseminacao(val);
              setTagBufalo('');
              setTagBufala('');
              setIdDoadora(null);
              setNomeDoadora('');
              setIdSemenSelecionado(null);
              setIdOvuloSelecionado(null);
            }}
            title={t("forms.add.typeSelect")}
            placeholder={t("forms.add.typeSelect")}
          />
        </View>

        {/* --- Animais --- */}
        <Text style={styles.sectionTitle}>{t("forms.add.animalsSection")}</Text>

        <View style={styles.listContainer}>
          {/* Macho só aparece para Monta Natural */}
          {tipoInseminacao === "Monta Natural" && (
            <>
              <Text style={styles.label}>{t("forms.add.maleTag")} <Text style={{ color: colors.status.error }}>*</Text></Text>
              <NfcTextInput
                mode="brinco"
                sexo="M"
                onResult={setTagBufalo}
                propriedadeId={propriedadeSelecionada ?? undefined}
                value={tagBufalo}
                onChangeText={setTagBufalo}
                placeholder={t("forms.shared.nfcPlaceholder")}
              />
            </>
          )}

          <Text style={styles.label}>
            {t("forms.add.femaleTag")} {tipoInseminacao === "Monta Natural" ? t("forms.add.femaleReceptorNatural") : t("forms.add.femaleReceptorOther")}
            {" "}<Text style={{ color: colors.status.error }}>*</Text>
          </Text>
          <NfcTextInput
            mode="brinco"
            sexo="F"
            onResult={setTagBufala}
            propriedadeId={propriedadeSelecionada ?? undefined}
            value={tagBufala}
            onChangeText={setTagBufala}
            placeholder={t("forms.shared.nfcPlaceholder")}
          />
        </View>

        {/* --- Material Genético: IA/IATF = Sêmen obrigatório --- */}
        {(tipoInseminacao === "IA" || tipoInseminacao === "IATF") && (
          <>
            <Text style={styles.sectionTitle}>{t("forms.add.geneticSection")}</Text>
            <View style={styles.listContainer}>
              <Text style={styles.label}>
                {t("forms.add.semenLabel")} <Text style={{ color: colors.status.error }}>*</Text>
              </Text>
              {matGeneticoSemen.length === 0 ? (
                <Text style={{ color: '#999', marginBottom: 12, fontSize: 13 }}>
                  {t("forms.add.noSemen")}
                </Text>
              ) : (
                <SelectBottomSheet
                  items={matGeneticoSemen.map(m => ({ label: m.label, value: m.id }))}
                  value={idSemenSelecionado}
                  onChange={(val: any) => setIdSemenSelecionado(val)}
                  title={t("forms.add.semenSelect")}
                  placeholder={t("forms.add.semenPlaceholder")}
                />
              )}
            </View>
          </>
        )}

        {/* --- TE: Embrião (doadora auto-derivada) --- */}
        {tipoInseminacao === "TE" && (
          <>
            <Text style={styles.sectionTitle}>{t("forms.add.geneticSection")}</Text>
            <View style={styles.listContainer}>
              <Text style={styles.label}>
                {t("forms.add.embryoLabel")} <Text style={{ color: colors.status.error }}>*</Text>
              </Text>
              {embrioesFiltrados.length === 0 ? (
                <Text style={{ color: '#999', marginBottom: 12, fontSize: 13 }}>
                  {t("forms.add.noEmbryo")}
                </Text>
              ) : (
                <SelectBottomSheet
                  items={embrioesFiltrados.map(m => ({ label: m.label, value: m.id }))}
                  value={idOvuloSelecionado}
                  onChange={async (val: any) => {
                    setIdOvuloSelecionado(val);
                    const item = embrioesFiltrados.find(m => m.id === val);
                    const doadoraUUID = item?.idBufalOrigem ?? null;
                    setIdDoadora(doadoraUUID);
                    if (doadoraUUID) {
                      const bufala = await getBufaloById(doadoraUUID);
                      setNomeDoadora(bufala ? `${bufala.brinco} — ${bufala.nome}` : doadoraUUID.slice(0, 8));
                    } else {
                      setNomeDoadora('');
                    }
                  }}
                  title={t("forms.add.embryoSelect")}
                  placeholder={t("forms.add.embryoPlaceholder")}
                />
              )}
              {nomeDoadora ? (
                <Text style={[styles.label, { color: colors.text.secondary, marginTop: 8 }]}>
                  {t("forms.add.donor", { nome: nomeDoadora })}
                </Text>
              ) : null}
            </View>
          </>
        )}

        {/* Footer (Botões Salvar e Cancelar) */}
        <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>{t("forms.shared.cancel")}</Text>
            </TouchableOpacity>
            <YellowButton title={t("forms.add.submit")} onPress={handleSave} />
        </View>

      </BottomSheetScrollView>
    </BottomSheet>
  );
};

// ==========================================================
// --- ESTILOS (Adaptados e Consolidados) ---
// ==========================================================

const styles = StyleSheet.create({
    // Estilos do BottomSheet
    sheetBackground: { backgroundColor: colors.bg.sheet, borderRadius: 24 },
    handleIndicator: { backgroundColor: colors.border.light, height: 4, width: 36 },

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

    // --- Estilos da Lista e Itens ---
    listContainer: {
        backgroundColor: colors.bg.card,
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        overflow: "visible", 
        zIndex: 100, // ZIndex padrão para o conteúdo
        marginBottom: 8,
    },
    
    // --- Estilos do Dropdown (Padrão) ---
    dropdownLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4,
    },
    dropdownStyle: {
        borderColor: colors.border.default,
        backgroundColor: colors.bg.card,
        height: 50,
    },
    dropdownContainerStyle: {
        borderColor: colors.border.default,
        height: 50,
    },

    // --- Footer ---
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: colors.border.default,
        marginTop: 16,
    },
    cancelButton: { 
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    cancelText: { 
        color: colors.status.error, 
        fontWeight: "bold",
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: "600",
        marginBottom: 4,
    },
});