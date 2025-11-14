import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/colors";
import Pen from "../../../assets/images/pen.svg";

export const ZootecnicoBottomSheet = ({ visible, onClose, item }: any) => {
    if (!item) return null;

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "90%"], []);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...item });

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleChange = (key: string, value: string, p0: boolean) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      console.log("Salvar alterações:", formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      onChange={handleSheetChange}
      backgroundStyle={{ backgroundColor: "#F8F7F5", borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: colors.yellow.base }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalhes do Evento</Text>
            <View style={{ width: 24 }} />
          </View>

            <View style={styles.card}>
              <View style={styles.centerBlock}>
                <Text style={styles.label}>
                  Registro {String(formData.tipo_pesagem ?? "")}
                </Text>
                <Text style={styles.date}>
                  {formData?.dt_registro
                    ? formData.dt_registro.split("T")[0].split("-").reverse().join("/")
                    : "Nda"}
                </Text>
              </View>

              {/* Linhas de dados */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Peso (Kg)</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.peso?.toString() ?? ""}
                    onChangeText={(t) => handleChange("peso", t, true)}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Condição Corporal</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    keyboardType="numeric"
                    value={formData.condicao_corporal?.toString() ?? ""}
                    onChangeText={(t) => handleChange("condicao_corporal", t, true)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Cor Pelagem</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.cor_pelagem ?? ""}
                    onChangeText={(t) => handleChange("cor_pelagem", t, false)}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Formato Chifre</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.formato_chifre ?? ""}
                    onChangeText={(t) => handleChange("formato_chifre", t, false)}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Porte Corporal</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.porte_corporal ?? ""}
                    onChangeText={(t) => handleChange("porte_corporal", t, false)}
                  />
                </View>
              </View>

              {Boolean(formData.retorno) && (
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Data de Retorno</Text>
                  <Text style={styles.value}>
                    {String(formData.dt_retorno ?? "-")}
                  </Text>
                </View>
              )}
            </View>
          {/* Rodapé */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={toggleEdit}
            >
              <Pen width={25} height={25} />
              <Text style={styles.editText}>
                {isEditing ? "Salvar Alterações" : "Editar Registro"}
              </Text>
            </TouchableOpacity>
            {!isEditing && (
              <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                <Text style={styles.deleteText}>Excluir Registro</Text>
              </TouchableOpacity>
            )}
          </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.brown.base,
    marginBottom: 12,
  },
  row: { marginBottom: 12, flexDirection: "row" },
  label: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 16, color: "#111" },
  inputEditable: {
    borderBottomWidth: 1,
    borderColor: colors.yellow.base,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
  editButton: {
    backgroundColor: colors.yellow.base,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  editText: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.brown.base,
    marginLeft: 6,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#EF4444",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#F8F7F5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  centerBlock: { alignItems: "center", marginBottom: 8 },
  date: { fontSize: 22, fontWeight: "700", color: colors.yellow.dark },
  col: { flex: 1 },
  infoBlock: { marginBottom: 8 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  }
});
