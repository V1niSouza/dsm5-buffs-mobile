import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import YellowButton from "../Button";

interface FormReproducaoAddProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function FormReproducaoAdd({ onSuccess, onClose }: FormReproducaoAddProps) {
  const [tagBufalo, setTagBufalo] = useState(""); // macho
  const [tagBufala, setTagBufala] = useState(""); // receptora
  const [idOvulo, setIdOvulo] = useState("");     // opcional
  const [idSemen, setIdSemen] = useState("");     // opcional
  const [tipoInseminacao, setTipoInseminacao] = useState("");
  const [status, setStatus] = useState("Em andamento");

  const [openTipo, setOpenTipo] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const handleSave = async () => {
    try {
      const payload = {
        tagBufalo,
        tagBufala,
        id_ovulo: idOvulo || null,
        id_semen: idSemen || null,
        tipo_inseminacao: tipoInseminacao,
        status,
        dt_evento: new Date().toISOString().split("T")[0], // automático
      };

      console.log("Payload reprodução:", payload);
      Alert.alert("Sucesso", "Reprodução cadastrada!");
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao salvar reprodução:", err);
      Alert.alert("Erro", "Não foi possível salvar a reprodução.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Animais</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Tag do Búfalo (macho)"
        value={tagBufalo}
        onChangeText={setTagBufalo}
      />
      <TextInput
        style={styles.inputFull}
        placeholder="Tag da Búfala (fêmea receptora)"
        value={tagBufala}
        onChangeText={setTagBufala}
      />

      <Text style={styles.sectionTitle}>Opções</Text>
      <DropDownPicker
        open={openTipo}
        setOpen={setOpenTipo}
        value={tipoInseminacao}
        setValue={setTipoInseminacao}
        items={[
          { label: "IA (Inseminação Artificial)", value: "IA" },
          { label: "Monta Natural", value: "Natural" },
        ]}
        placeholder="Selecione o tipo"
        containerStyle={{ marginBottom: 12 }}
        listMode="SCROLLVIEW"
        zIndex={5000}
      />

      <Text style={styles.sectionTitle}>Extras (opcional)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="ID do Óvulo (se não for da receptora)"
        value={idOvulo}
        onChangeText={setIdOvulo}
      />
      <TextInput
        style={styles.inputFull}
        placeholder="ID do Sêmen (IA)"
        value={idSemen}
        onChangeText={setIdSemen}
        keyboardType="numeric"
      />

      <YellowButton title="Salvar Reprodução" onPress={handleSave} />
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
  info: {
    marginTop: 12,
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
  },
});
