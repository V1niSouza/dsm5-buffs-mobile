import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/colors";
import YellowButton from "../Button";
import bufaloService from "../../services/bufaloService";

// Tipagem idêntica à sua
type Filtros = {
  brinco?: string;
  sexo?: "M" | "F";
  nivel_maturidade?: "B" | "N" | "V" | "T";
  status?: boolean;
  id_raca?: string;
};

interface Props {
  filtros: Filtros;
  onFiltrar: (f: Filtros) => void;
  onClose: () => void;
}

export default function FiltroRebanhoBottomSheet({ filtros, onFiltrar, onClose }: Props) {
  const { t } = useTranslation("rebanho");
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "70%"], []);

  const [racas, setRacas] = useState<any[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>("Sexo");
  const [sexo, setSexo] = useState<string | null>(null);
  const [raca, setRaca] = useState<string | null>(null);
  const [maturidade, setMaturidade] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Categorias e opções: `value` é o código estável (PT) usado na lógica/payload;
  // `label` é apenas o texto traduzido exibido. Nunca comparar pelo label.
  const categorias = [
    { value: "Sexo", label: t("filter.categories.sexo") },
    { value: "Raça", label: t("filter.categories.raca") },
    { value: "Maturidade", label: t("filter.categories.maturidade") },
    { value: "Status", label: t("filter.categories.status") },
  ];
  const opcoes: Record<string, { value: string; label: string }[]> = {
    Sexo: [
      { value: "Macho", label: t("filter.sex.male") },
      { value: "Fêmea", label: t("filter.sex.female") },
    ],
    Raça: racas.map((r) => ({ value: r.nome, label: r.nome })),
    Maturidade: [
      { value: "Bezerro", label: t("maturity.B") },
      { value: "Novilha", label: t("maturity.N") },
      { value: "Vaca", label: t("maturity.V") },
      { value: "Touro", label: t("maturity.T") },
    ],
    Status: [
      { value: "Ativo", label: t("filter.status.active") },
      { value: "Inativo", label: t("filter.status.inactive") },
    ],
  };

  useEffect(() => {
    bufaloService.getRacas().then(data => setRacas(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    // Quando o modal abre, preenchemos os estados internos com o que já existe no "pai"
    if (filtros.sexo) setSexo(filtros.sexo === "M" ? "Macho" : "Fêmea");

    if (filtros.nivel_maturidade) {
      const reverseMap: any = { B: "Bezerro", N: "Novilha", V: "Vaca", T: "Touro" };
      setMaturidade(reverseMap[filtros.nivel_maturidade]);
    }

    if (filtros.status !== undefined) setStatus(filtros.status ? "Ativo" : "Inativo");

    if (filtros.id_raca && racas.length > 0) {
      const r = racas.find(x => (x.id_raca ?? x.id) === filtros.id_raca);
      if (r) setRaca(r.nome);
    }
  }, [filtros, racas]);

  const aplicar = () => {
    const payload: Filtros = {};
    if (sexo) payload.sexo = sexo === "Macho" ? "M" : "F";
    if (maturidade) {
      const map: any = { Bezerro: "B", Novilha: "N", Vaca: "V", Touro: "T" };
      payload.nivel_maturidade = map[maturidade];
    }
    if (status) payload.status = status === "Ativo";
    if (raca) {
      const r = racas.find(x => x.nome === raca);
      payload.id_raca = r?.id_raca ?? r?.id;
    }
    onFiltrar(payload);
    onClose();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
      backgroundStyle={{ backgroundColor: colors.bg.sheet }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t("filter.title")}</Text>
          <TouchableOpacity onPress={() => { setSexo(null); setRaca(null); setMaturidade(null); setStatus(null); }}>
            <Text style={{ color: colors.status.error }}>{t("filter.clear")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t("filter.categoriesLabel")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {categorias.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.chip, categoriaAtiva === cat.value && styles.chipAtivo]}
              onPress={() => setCategoriaAtiva(cat.value)}
            >
              <Text style={[styles.chipText, categoriaAtiva === cat.value && styles.chipTextAtivo]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.optionsGrid}>
          {opcoes[categoriaAtiva!]?.map(opcao => {
            const isSel = [sexo, raca, maturidade, status].includes(opcao.value);
            return (
              <TouchableOpacity
                key={opcao.value}
                style={[styles.opt, isSel && styles.optAtivo]}
                onPress={() => {
                  if (categoriaAtiva === "Sexo") setSexo(sexo === opcao.value ? null : opcao.value);
                  if (categoriaAtiva === "Raça") setRaca(raca === opcao.value ? null : opcao.value);
                  if (categoriaAtiva === "Maturidade") setMaturidade(maturidade === opcao.value ? null : opcao.value);
                  if (categoriaAtiva === "Status") setStatus(status === opcao.value ? null : opcao.value);
                }}
              >
                <Text style={[styles.optText, isSel && styles.optTextAtivo]}>{opcao.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <YellowButton title={t("filter.apply")} onPress={aplicar} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 12, color: colors.text.muted, marginBottom: 10, fontWeight: '600' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.bg.subtle, borderRadius: 12, marginRight: 8 },
  chipAtivo: { backgroundColor: colors.brand.primary },
  chipText: { fontWeight: '500' },
  chipTextAtivo: { color: colors.text.accent },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  opt: { width: '47%', padding: 12, backgroundColor: colors.bg.card, borderRadius: 12, borderWidth: 1, borderColor: colors.bg.subtle, alignItems: 'center' },
  optAtivo: { borderColor: colors.brand.primary, backgroundColor: colors.status.warningBg },
  optText: { color: colors.text.body },
  optTextAtivo: { fontWeight: 'bold', color: colors.text.accent }
});