import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../styles/colors";
import YellowButton from "../Button";
import TextTitle from "../TextTitle";

type Alerta = {
  id: number;
  titulo: string;
  descricao: string;
  horario: string;
  local: string;
  categoria: string;
  prioridade: "Alta" | "Média" | "Baixa";
};

export default function AlertasPendentes() {
  const alertas: Alerta[] = [
    { id: 1, titulo: "Tratamento antibiótico pendente", descricao: "Búfala #B-0045 precisa receber a segunda dose do antibiótico para mastite", horario: "Hoje", local: "Esperança", categoria: "Tratamento", prioridade: "Alta" },
    { id: 2, titulo: "Acompanhamento pós-parto", descricao: "Verificar estado geral da búfala que pariu há 3 dias", horario: "Amanhã", local: "Bonança", categoria: "Acompanhamento", prioridade: "Média" },
    { id: 3, titulo: "Vacinação contra brucelose", descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas", horario: "Esta semana", local: "", categoria: "Vacinação", prioridade: "Média" },
    { id: 4, titulo: "Vacinação contra brucelose", descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas", horario: "Esta semana", local: "", categoria: "Vacinação", prioridade: "Média" },
    { id: 5, titulo: "Vacinação contra brucelose", descricao: "Lote de bezerras entre 3-8 meses precisam ser vacinadas", horario: "Esta semana", local: "", categoria: "Vacinação", prioridade: "Média" },
  ];

  const itensPorPagina = 3;
  const [paginaAtual, setPaginaAtual] = useState(0);

  const startIndex = paginaAtual * itensPorPagina;
  const endIndex = startIndex + itensPorPagina;
  const dadosPagina = alertas.slice(startIndex, endIndex);

  const totalPaginas = Math.ceil(alertas.length / itensPorPagina);

  const renderItem = ({ item }: { item: Alerta }) => (
    <TouchableOpacity style={styles.alertaContainer}>
      <View style={styles.alertaRow}>
        <View style={styles.alertaInfo}>
          <Text style={styles.alertaTitulo}>{item.titulo}</Text>
          <Text style={styles.alertaDescricao}>{item.descricao}</Text>
        </View>
      </View>

      <View style={styles.alertaFooter}>
        <Text style={styles.alertaHorario}>⏰ {item.horario}</Text>
        <View style={styles.categoriaBox}>
          <Text style={styles.categoriaText}>{item.categoria}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextTitle>Alertas Pendentes ({alertas.length})</TextTitle>
      </View>
      <FlatList
        data={dadosPagina}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false} 
      />

      {/* Paginação usando o YellowButton */}
      <View style={styles.pagination}>
        <YellowButton
          title="Anterior"
          onPress={() => setPaginaAtual(paginaAtual - 1)}
          disabled={paginaAtual === 0}
        />
        <Text style={styles.pageInfo}>
          Página {paginaAtual + 1} de {totalPaginas}
        </Text>
        <YellowButton
          title="Próxima"
          onPress={() => setPaginaAtual(paginaAtual + 1)}
          disabled={paginaAtual + 1 >= totalPaginas}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: colors.white.base,
    marginBottom: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    shadowColor: colors.black.base,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },
  scrollContent: { 
    paddingBottom: 8 
  },
  alertaContainer: { 
    backgroundColor: colors.white.base,
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    shadowColor: colors.black.base,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  alertaRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    marginBottom: 8 
  },
  alertaInfo: { 
    flex: 1, 
    paddingRight: 8 
  },
  alertaTitulo: { 
    fontWeight: "bold", 
    fontSize: 14, 
    marginBottom: 4 
  },
  alertaDescricao: { 
    fontSize: 12, 
    color: colors.gray.base 
  },
  alertaFooter: { 
    flexDirection: "row", 
    alignItems: "center", 
    flexWrap: "wrap", 
    gap: 8 
  },
  alertaHorario: { 
    fontSize: 12, 
    color: colors.gray.base, 
    marginRight: 8 
  },
  categoriaBox: { 
    backgroundColor: colors.gray.claro, 
    borderRadius: 6, 
    paddingVertical: 2, 
    paddingHorizontal: 6 
  },
  categoriaText: { 
    fontSize: 12, 
    color: colors.gray.base 
  },
  pagination: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 12 
  },
  pageInfo: { 
    fontWeight: "600" 
  },
});
