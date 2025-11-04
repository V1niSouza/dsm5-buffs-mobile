import React, { useState, useEffect } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import YellowButton from "../Button";

interface FormColetaProps {
    industrias?: any[];
    onSuccess?: () => void;
}

export function FormColeta({ industrias: industriasProp = [], onSuccess }: FormColetaProps) {
  const [industrias, setIndustrias] = useState<any[]>(industriasProp);
  const [idIndustria, setIdIndustria] = useState<string | null>(null);
  const [openIndustria, setOpenIndustria] = useState(false);

  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [resultadoTeste, setResultadoTeste] = useState<boolean | null>(null);
  const [dtColeta, setDtColeta] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setIndustrias(industriasProp);
  }, [industriasProp]);

  const handleSave = async () => {
    try {
      if (!idIndustria) {
        Alert.alert("Erro", "Selecione uma indústria.");
        return;
      }
      if (!quantidade) {
        Alert.alert("Erro", "Informe a quantidade coletada.");
        return;
      }

      const payload = {
        id_industria: idIndustria,
        quantidade: parseFloat(quantidade),
        dt_coleta: dtColeta?.toISOString() || new Date().toISOString(),
        resultado_teste: resultadoTeste ?? true,
        observacao,
      };

      // await registrarColeta(payload);
      Alert.alert("Sucesso", "Coleta registrada com sucesso!");
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao salvar coleta:", err);
      Alert.alert("Erro", "Não foi possível registrar a coleta.");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Indústria</Text>
      <DropDownPicker
        open={openIndustria}
        setOpen={setOpenIndustria}
        value={idIndustria}
        setValue={setIdIndustria}
        items={industrias.map((i) => ({
          label: i.nome,
          value: i.id_industria,
        }))}
        placeholder="Selecione a indústria"
        listMode="SCROLLVIEW"
        zIndex={3000}
      />

      <Text style={styles.sectionTitle}>Quantidade (litros)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Ex: 250.5"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <Text style={styles.sectionTitle}>Resultado do Teste</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.testButton,
            resultadoTeste === true && styles.testButtonSelected,
          ]}
          onPress={() => setResultadoTeste(true)}
        >
          <Text>Aprovado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.testButton,
            resultadoTeste === false && styles.testButtonSelected,
          ]}
          onPress={() => setResultadoTeste(false)}
        >
          <Text>Reprovado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Data da Coleta</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputFull}
      >
        <Text>
          {dtColeta ? dtColeta.toISOString().split("T")[0] : "Selecione a data"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dtColeta || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            if (date) setDtColeta(date);
            setShowDatePicker(Platform.OS === "ios");
          }}
        />
      )}

      <Text style={styles.sectionTitle}>Observação</Text>
      <TextInput
        style={[styles.inputFull, { height: 80 }]}
        placeholder="Digite uma observação"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <YellowButton title="Salvar Coleta" onPress={handleSave} />
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
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  testButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  testButtonSelected: {
    backgroundColor: "#cce5ff",
    borderColor: "#007bff",
  },
});
