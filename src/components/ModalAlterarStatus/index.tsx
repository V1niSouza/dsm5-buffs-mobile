import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../styles/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  novoStatus: boolean; 
};

export const ConfirmarAlteracaoStatusModal = ({
  visible,
  onClose,
  onConfirm,
  novoStatus,
}: Props) => {

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Confirmar alteração</Text>

          <Text style={styles.modalMessage}>
            Tem certeza que deseja alterar o status do animal para{" "}
            <Text style={{ fontWeight: "700" }}>
              {novoStatus ? "ATIVO" : "INATIVO"}
            </Text>
            ?
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.btnTextCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnConfirmar} onPress={onConfirm}>
              <Text style={styles.btnTextConfirmar}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ======== ESTILOS ========
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.red.inactive,
  },
  btnConfirmar: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.green.active,
  },
  btnTextCancelar: {
    color: colors.red.text,
    fontWeight: "600",
  },
  btnTextConfirmar: {
    color: colors.green.text,
    fontWeight: "600",
  },
});
