import React from "react";
import { Modal as RNModal, View, StyleSheet } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
  },
});
