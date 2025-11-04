import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../../styles/colors";
import YellowButton from "../Button";
import TextTitle from "../TextTitle";
import CalendarIcon from "../../icons/calendar";
import { getAlertasPorPropriedade, Alerta as AlertaApi } from "../../services/alertaService";

type Alerta = AlertaApi;


export default function AlertasPendentes({ idPropriedade }: { idPropriedade: string | null } ) {

  // Função auxiliar para formatar
  function formatarDataSimples(dataISO: string) {
    if (!dataISO) {
      return '-';
    }
    const soData = dataISO.split('T')[0];
    const partes = soData.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalAlertas, setTotalAlertas] = useState(0);

  const fetchAlertas = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAlertasPorPropriedade(idPropriedade, page, 3);
      setAlertas(response.alertas);
      setTotalPaginas(response.meta.totalPages);
      setPaginaAtual(response.meta.page);
      setTotalAlertas(response.meta.total);
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idPropriedade) return;

    // Resetar página para 1 sempre que a propriedade mudar
    setPaginaAtual(1);
  }, [idPropriedade]);

  useEffect(() => {
    if (!idPropriedade) return;

    // Buscar alertas sempre que mudar página ou propriedade
    fetchAlertas(paginaAtual);
  }, [idPropriedade, paginaAtual]);


  const renderItem = ({ item }: { item: Alerta }) => (
    <TouchableOpacity style={styles.alertaContainer}>
      <View style={styles.alertaRow}>
        <View style={styles.alertaInfo}>
          <Text style={styles.alertaTitulo}>{item.motivo}</Text>
          <Text style={styles.alertaDescricao}>{item.observacao}</Text>
        </View>
      </View>

      <View style={styles.alertaFooter}>
        <Text style={styles.alertaHorario}>
          <CalendarIcon fill={colors.yellow.base} size={15}/> {formatarDataSimples(item.data_alerta)}
        </Text>
        <View style={styles.categoriaBox}>
          <Text style={styles.categoriaText}>{item.nicho}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextTitle>Alertas Pendentes ({totalAlertas})</TextTitle>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.yellow.base} size="large" />
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id_alerta}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={false} 
        />
      )}

      <View style={styles.pagination}>
        <YellowButton
          title="Anterior"
          onPress={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
        />
        <Text style={styles.pageInfo}>
          Página {paginaAtual} de {totalPaginas}
        </Text>
        <YellowButton
          title="Próxima"
          onPress={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual >= totalPaginas}
        />
      </View>
    </View>
  );
}

// Mantém seus estilos
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
    borderRadius: 14,
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
