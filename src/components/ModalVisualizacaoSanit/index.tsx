import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { colors } from "../../styles/colors";
import Back from "../../../assets/images/arrow.svg";
import Pen from "../../../assets/images/pen.svg";

export const SanitarioDetailModal = ({ visible, onClose, item }: any) => {
  if (!item) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...item });

  // Alterna entre modo de edição e visualização
  const toggleEdit = () => {
    if (isEditing) {
      console.log("Dados salvos:", formData);
      // Aqui pode entrar a lógica de atualização (API PUT, por exemplo)
    }
    setIsEditing(!isEditing);
  };

  // Função auxiliar para formatação de data
  const formatarDataSimples = (dataISO: string) => {
    if (!dataISO) return "-";
    const soData = dataISO.split("T")[0];
    const partes = soData.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // Atualiza campo do formulário
  const handleChange = (key: string, value: string | boolean, p0: boolean) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Back width={25} height={25} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalhes do Evento Sanitário</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Conteúdo */}
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <View style={styles.centerBlock}>
                <Text style={styles.labelPrincipal}>Doença</Text>
                <TextInput
                  style={[styles.valuePrincipal, isEditing && styles.inputEditable]}
                  editable={isEditing}
                  value={formData.doenca ?? ""}
                  onChangeText={(t) => handleChange("doenca", t, false)}
                />
              </View>

              {/* Linha 2: Medicação e Data */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Medicação Aplicada</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.nome_medicamento ?? ""}
                    onChangeText={(t) => handleChange("nome_medicamento", t, false)}
                  />
                </View>
                </View>
                <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Data</Text>
                  <Text style={styles.value}>
                    {formData?.dt_aplicacao
                      ? formatarDataSimples(formData.dt_aplicacao)
                      : "-"}
                  </Text>
                </View>
              </View>

              {/* Linha 3: Dosagem + Unidade */}
              <View style={styles.row}>
                {isEditing ? (
                  <>
                    <View style={styles.col}>
                      <Text style={styles.label}>Dosagem</Text>
                      <TextInput
                        style={[styles.value, styles.inputEditable]}
                        editable={true}
                        keyboardType="numeric"
                        value={formData.dosagem?.toString() ?? ""}
                        onChangeText={(t) => handleChange("dosagem", t, false)}
                      />
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.label}>Unidade</Text>
                      <TextInput
                        style={[styles.value, styles.inputEditable]}
                        editable={true}
                        value={formData.unidade_medida ?? ""}
                        onChangeText={(t) => handleChange("unidade_medida", t, false)}
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.col}>
                    <Text style={styles.label}>Dosagem</Text>
                    <Text style={styles.value}>
                      {formData.dosagem ?? "-"}
                      {formData.unidade_medida ?? ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* Informações do sistema */}
            <View style={styles.card}>
              {/* Retorno */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Necessita Retorno</Text>
                  <TextInput
                    style={[styles.value, isEditing && styles.inputEditable]}
                    editable={isEditing}
                    value={formData.necessita_retorno ? "Sim" : "Não"}
                    onChangeText={(t) =>
                      handleChange("necessita_retorno", t.toLowerCase() === "sim", true)
                    }
                  />
                </View>

                {formData.necessita_retorno && (
                  <View style={styles.col}>
                    <Text style={styles.label}>Data de Retorno</Text>
                    <TextInput
                      style={[styles.value, isEditing && styles.inputEditable]}
                      editable={isEditing}
                      value={
                        formData.dt_retorno
                          ? formatarDataSimples(formData.dt_retorno)
                          : "-"
                      }
                      onChangeText={(t) => handleChange("dt_retorno", t, false)}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Rodapé */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={toggleEdit}
            >
              <Pen width={20} height={20} />
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
        </View>
      </View>
    </Modal>
  );
};

// ======== ESTILOS ========
const styles = StyleSheet.create({
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
  content: {
    padding: 16,
    gap: 12,
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
  centerBlock: { 
    alignItems: "center", 
    marginBottom: 8 
  },
  label: { 
    fontSize: 12, 
    color: "#6B7280" 
  },
  date: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: colors.yellow.base 
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    borderBottomWidth: 0,
  },
  inputEditable: {
    borderBottomWidth: 1,
    borderColor: colors.yellow.base,
    paddingVertical: 2,
  },
  row: { 
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  col: { 
    flex: 1, 
    marginLeft: 10
  },
  infoBlock: { marginBottom: 8 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
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
  labelPrincipal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  valuePrincipal: {
    fontSize: 30,
    fontWeight: "600",
    color: colors.yellow.dark,
  },  
});
