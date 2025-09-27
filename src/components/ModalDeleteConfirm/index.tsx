// ConfirmModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modal } from "../Modal"; // seu componente já existente

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  message: { fontSize: 16, marginBottom: 16 },
  buttons: { flexDirection: "row", justifyContent: "flex-end" },
  cancelButton: { padding: 10, marginRight: 10 },
  cancelText: { color: "gray" },
  confirmButton: { padding: 10, backgroundColor: "red", borderRadius: 6 },
  confirmText: { color: "#fff", fontWeight: "bold" },
});
