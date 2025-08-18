import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../styles/colors";
import { useDimensions } from "../../utils/useDimensions";

export default function AlertasPendentes() {
  const alertas = [
    {
      id: 1,
      titulo: "Tratamento antibiótico pendente",
      descricao: "Búfala #B-0045 precisa receber a segunda dose do antibiótico para mastite",
      horario: "Hoje",
      local: "Esperança",
      categoria: "Tratamento",
      prioridade: "Alta",
    },
    {
      id: 2,
      titulo: "Acompanhamento pós-parto",
      descricao: "Verificar estado geral da búfala que pariu há 3 dias",
      horario: "Amanhã",
      local: "Bonança",
      categoria: "Acompanhamento",
      prioridade: "Média",
    },
    {
      id: 3,
      titulo: "Vacinação contra brucelose",
      descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas",
      horario: "Esta semana",
      local: "",
      categoria: "Vacinação",
      prioridade: "Média",
    },
  
    {
      id: 4,
      titulo: "Vacinação contra brucelose",
      descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas",
      horario: "Esta semana",
      local: "",
      categoria: "Vacinação",
      prioridade: "Média",
    },

    {
      id: 5,
      titulo: "Vacinação contra brucelose",
      descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas",
      horario: "Esta semana",
      local: "",
      categoria: "Vacinação",
      prioridade: "Média",
    },
  ];

  const { wp, hp } = useDimensions();
  
  const prioridadeCores = {
    Alta: "#EF4444", // vermelho
    Média: "#F59E0B", // amarelo
    Baixa: "#10B981", // verde
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alertas Pendentes ({alertas.length})</Text>
      <ScrollView 
        style={{ maxHeight: hp(40) }}  // Altura máxima
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}  // Importante quando dentro de outro ScrollView
      >
        {alertas.map((alerta) => (
          <TouchableOpacity key={alerta.id} style={styles.alertaContainer}>
            <View style={styles.alertaRow}>
              <View style={styles.alertaInfo}>
                <Text style={styles.alertaTitulo}>{alerta.titulo}</Text>
                <Text style={styles.alertaDescricao}>{alerta.descricao}</Text>
              </View>
            </View>

            <View style={styles.alertaFooter}>
              <Text style={styles.alertaHorario}>⏰ {alerta.horario}</Text>
              <View style={styles.categoriaBox}>
                <Text style={styles.categoriaText}>{alerta.categoria}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white.base,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
    scrollContent: {
    paddingBottom: 8, // Espaço no final
  },
  alertaContainer: {
    borderWidth: 1,
    borderColor: colors.yellow.base,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.white.base
  },
  alertaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  alertaInfo: {
    flex: 1,
    paddingRight: 8,
  },
  alertaTitulo: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  alertaDescricao: {
    fontSize: 12,
    color: colors.gray.base
  },
  alertaPrioridade: {
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4,
  },
  alertaFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  alertaHorario: {
    fontSize: 12,
    color: colors.gray.base,
    marginRight: 8,
  },
  categoriaBox: {
    backgroundColor: colors.gray.claro,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  categoriaText: {
    fontSize: 12,
    color: colors.gray.base,
  },
});
