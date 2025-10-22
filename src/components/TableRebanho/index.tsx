import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from "react-native";
import { colors } from "../../styles/colors"; // ajuste para seu projeto
import BuffsLogo from '../../../assets/images/buffs.svg'; 
import Prontuario from '../../../assets/images/prontuario.svg'; 
import Button from "../Button";


export type Animal = {
  categoria: string;
  id: number | number;
  status: boolean;   // true = verde, false = vermelho
  brinco: string;
  nome: string;
  raca: string;
  sexo: string;
};

type Props = {
  data: Animal[];
  onVerMais: (animal: Animal) => void; 
};

export default function TableAnimais({ data, onVerMais }: Props) {
  return (
    <View>
      {/* Cabeçalho */}
      <View style={styles.listHeader}>
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <BuffsLogo width={18} height={18} />
        </View>
        <Text style={[styles.listHeaderText, { flex: 1 }]}>Brinco</Text>
        <Text style={[styles.listHeaderText, { flex: 1 }]}>Nome</Text>
        <Text style={[styles.listHeaderText, { flex: 2 }]}>Raça</Text>
        <Text style={[styles.listHeaderText, { flex: 1 }]}>Sexo</Text>
        <Text style={[styles.listHeaderText, { flex: 1 }]}>Ver Mais</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={data}
        scrollEnabled={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* Status */}
            <View
              style={[
                styles.statusCircle,
                { backgroundColor: item.status ? colors.green.active : colors.red.inactive },
              ]}
            />

            {/* Colunas */}
            <Text style={[styles.itemText, { flex: 1 }]} numberOfLines={1}>
              {item.brinco}
            </Text>
            <Text style={[styles.itemText, { flex: 1 }]} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={[styles.itemText, { flex: 2 }]} numberOfLines={1}>
              {item.raca ?? "Sem raça"}
            </Text>
            <Text style={[styles.itemText, { flex: 1 }]} numberOfLines={1}>
              {item.sexo}
            </Text>

            {/* Botão Ver Mais */}
            <TouchableOpacity
              onPress={() => onVerMais(item)}
              style={styles.linkButton}
            >
            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <Prontuario width={18} height={18} />
            </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  listHeaderText: {
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.gray.disabled,
  },
  itemText: {
    textAlign: "center",
    color: "#111827",
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 7,
    marginHorizontal: 6,
  },
  linkButton: {
    flex: 1,
    alignItems: "center",
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
