import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import YellowButton from "../Button";

interface FormLactacaoProps {
  animais: { id_bufala: string,
    brinco: string }[]; // lista de animais da tela
  onSuccess?: () => void;
}

export function FormLactacao({ animais, onSuccess }: FormLactacaoProps) {
  const [qtOrdenha, setQtOrdenha] = useState("");
  const [periodo, setPeriodo] = useState<string | null>(null);
  const [openPeriodo, setOpenPeriodo] = useState(false);
  const [ocorrencia, setOcorrencia] = useState("");
  const [dtOrdenha, setDtOrdenha] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

const handleSave = async () => {
  try {
    if (!qtOrdenha) {
      Alert.alert("Erro", "Informe a quantidade de ordenha.");
      return;
    }
    if (!periodo) {
      Alert.alert("Erro", "Selecione o período da ordenha.");
      return;
    }
    
    const payload = {
      id_bufala: animais[0].id_bufala,
      qt_ordenha: parseFloat(qtOrdenha),
      periodo,
      ocorrencia: ocorrencia || "",
      dt_ordenha: dtOrdenha?.toISOString() || new Date().toISOString(),
    };

   // await registrarLactacao(payload);
    Alert.alert("Sucesso", "Lactação registrada com sucesso!");
    onSuccess?.();
  } catch (err) {
    console.error("Erro ao salvar lactação:", err);
    Alert.alert("Erro", "Não foi possível registrar a lactação.");
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Búfala</Text>
      <Text style={[styles.inputFull, { paddingVertical: 10 }]}>
        {animais[0].brinco}
      </Text>

      <Text style={styles.sectionTitle}>Quantidade de Ordenha (litros)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Ex: 8.75"
        keyboardType="numeric"
        value={qtOrdenha}
        onChangeText={setQtOrdenha}
      />

      <Text style={styles.sectionTitle}>Período</Text>
      <DropDownPicker
        open={openPeriodo}
        setOpen={setOpenPeriodo}
        value={periodo}
        setValue={setPeriodo}
        items={[
          { label: "Manhã", value: "M" },
          { label: "Tarde", value: "T" },
        ]}
        placeholder="Selecione o período"
        listMode="SCROLLVIEW"
        zIndex={3000}
      />

      <Text style={styles.sectionTitle}>Ocorrência</Text>
      <TextInput
        style={[styles.inputFull, { height: 80 }]}
        placeholder="Digite alguma ocorrência (opcional)"
        value={ocorrencia}
        onChangeText={setOcorrencia}
        multiline
      />

      <Text style={styles.sectionTitle}>Data da Ordenha</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputFull}
      >
        <Text>
          {dtOrdenha ? dtOrdenha.toISOString().split("T")[0] : "Selecione a data"}
        </Text>
      </TouchableOpacity>


      <YellowButton title="Registrar Lactação" onPress={handleSave} />
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
