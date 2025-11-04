import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { updateReproducao } from "../../services/reproducaoService";
import YellowButton from "../Button";

interface FormReproducaoAttProps {
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const FormReproducaoAtt = ({ initialData, onClose, onSuccess }: FormReproducaoAttProps) => {
  const [form, setForm] = useState({
    dt_evento: initialData?.dt_evento || "",
    status: initialData?.status || "",
    tipo_parto: initialData?.tipo_parto || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      await updateReproducao(initialData.id, form);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atualizar Reprodução</Text>

      {Object.keys(form).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          value={String(form[field as keyof typeof form])}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <YellowButton title="Salvar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  cancelButton: { padding: 10, marginRight: 10 },
  cancelText: { color: colors.red.base },
  saveButton: { padding: 10, backgroundColor: colors.yellow.base, borderRadius: 8 },
  saveText: { color: "#fff", fontWeight: "bold" },
});
