import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { colors } from "../../styles/colors";
import { ConfirmModal } from "../ModalDeleteConfirm";
import { encerrarLactacao } from "../../services/lactacaoService";


export type CardLactacaoProps = {
  animal: any;
  onPress?: () => void;
  onStatusChanged?: () => void;
};

export const CardLactacao: React.FC<CardLactacaoProps> = ({ animal, onPress, onStatusChanged }) => {
  const isLactando = animal.status === "Em Lactação";
  const [isEnabled, setIsEnabled] = useState(isLactando);
  const [modalVisible, setModalVisible] = useState(false);
  console.log("Animal no CardLactacao:", animal);
  const toggleSwitch = () => {
    setModalVisible(true);
  };

  const confirmarSecagem = async () => {
    try {
      await encerrarLactacao(animal.idCicloLactacao);

      setIsEnabled(false);

      if (onStatusChanged) onStatusChanged();

    } catch (err) {
      console.log("Erro ao encerrar lactação:", err);
    } finally {
      setModalVisible(false);
    }
  };
  
  return (
    <>
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View
        style={[
          styles.statusBar,
          { backgroundColor: isLactando ? colors.green.active : colors.red.inactive },
        ]}
      />
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
        <View>
          <Text style={styles.nome}>{animal.nome || "Sem nome"}</Text>
          <Text style={styles.brinco}>Brinco: Nº {animal.brinco}</Text>
        </View>
        <View style={[styles.statusBadge, !isEnabled && styles.statusBadgeSeca]}>
          <View style={[ styles.statusDot, { backgroundColor: isEnabled ? colors.green.extra : colors.red.extra, }, ]} />
          <Text style={[ styles.statusText, { color: isEnabled ? colors.green.text : colors.red.text, },]}>
            {isEnabled ? "Em Lactação" : "Seca"}
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: colors.gray.claro, true: colors.gray.claro }}
            thumbColor={isEnabled ? colors.green.extra : colors.red.extra}
          />
        </View>
        </View>


        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Raça:</Text>
            <Text style={styles.chipValue}>{animal.raca || "—"}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Ciclo:</Text>
            <Text style={styles.chipValue}>{animal.cicloAtual ? `${animal.cicloAtual}º` : "—"}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Dias Lactação:</Text>
            <Text style={styles.chipValue}>{animal.diasEmLactacao ?? "—"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>

    <ConfirmModal
        visible={modalVisible}
        title="Confirmar Secagem"
        message={`Deseja marcar a vaca ${animal.nome} como seca?`}
        confirmText="Sim, Secar"
        cancelText="Cancelar"
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmarSecagem}
    />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
    marginBottom: 10,
  },
  statusBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  header: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nome: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  brinco: {
    fontSize: 13,
    color: "#6B7280",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    marginBottom: 6,
    gap: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginRight: 4,
  },
  chipValue: {
    fontSize: 13,
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  footerHighlight: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.yellow.base,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minHeight: 40,
    gap: 4,
    alignSelf: "flex-start", // 👈 evita esticar
  },

  statusBadgeSeca: {
    paddingHorizontal: 0, // 👈 MAIS ESPAÇO quando Seca
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 4 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
});
