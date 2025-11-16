import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { registrarEstoque } from "../../services/lactacaoService"; 
import { usePropriedade } from "../../context/PropriedadeContext";
import YellowButton from "../Button";

interface FormEstoqueProps {
  onSuccess?: () => void;
}

export function FormEstoque({ onSuccess }: FormEstoqueProps) {
  const [quantidade, setQuantidade] = useState("");
  const [dtRegistro, setDtRegistro] = useState<Date | null>(null);
  const [observacao, setObservacao] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { propriedadeSelecionada } = usePropriedade();
  

  const handleSave = async () => {
    try {
      if (!propriedadeSelecionada) {
        Alert.alert("Erro", "Selecione uma propriedade antes de registrar o estoque.");
        return;
      }

      if (!quantidade || !dtRegistro) {
        Alert.alert("Erro", "Preencha a quantidade e a data.");
        return;
      }

      const payload = {
        id_propriedade: propriedadeSelecionada,
        quantidade: Number(quantidade),
        dt_registro: dtRegistro.toISOString().split("T")[0],
        observacao: observacao || undefined,
      };
      console.log("Payload que será enviado:", payload);
      console.log("Tipo de dt_registro:", typeof payload.dt_registro);

      // await registrarEstoque(payload);
      Alert.alert("Sucesso", "Estoque registrado com sucesso!");
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao salvar estoque:", err);
      Alert.alert("Erro", "Não foi possível registrar no estoque.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Quantidade de Leite</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Quantidade (litros)"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <Text style={styles.sectionTitle}>Data do Registro</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputFull}
      >
        <Text>
          {dtRegistro
            ? dtRegistro.toISOString().split("T")[0]
            : "Selecione a Data"}
        </Text>
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>Observação</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Observações (opcional)"
        value={observacao}
        onChangeText={setObservacao}
      />
      <YellowButton title="Salvar no Estoque" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    justifyContent: "center",
  },
});
