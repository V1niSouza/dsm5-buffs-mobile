import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../../styles/colors";
import YellowButton from "../Button";
import TextTitle from "../TextTitle";
import CalendarIcon from "../../icons/calendar";
import { Tabs } from "../Tabs";
import { Modal } from "../Modal";
import { getAlertasPorPropriedade, Alerta as AlertaApi, Filtro, marcarAlertaVisto } from "../../services/alertaService";

type Alerta = AlertaApi;

export default function AlertasPendentes({ idPropriedade }: { idPropriedade: string | null }) {

  function formatarDataSimples(dataISO: string) {
    if (!dataISO) return "-";
    const soData = dataISO.split("T")[0];
    const [ano, mes, dia] = soData.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const [filtro, setFiltro] = useState<Filtro>("PENDENTES"); 
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  const fetchAlertas = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getAlertasPorPropriedade(
        idPropriedade,
        filtro,
        page,
        3
      );

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

  const confirmarVisto = async () => {
    if (!alertaSelecionado) return;
    try {
      await marcarAlertaVisto(alertaSelecionado.id_alerta);
      setAlertas((prev) =>
        prev.map((a) =>
          a.id_alerta === alertaSelecionado.id_alerta ? { ...a, visto: true } : a
        )
      );
    } catch (err) {
      console.error("Erro ao marcar como visto:", err);
    } finally {
      setModalVisible(false);
      setAlertaSelecionado(null);
    }
  };


  // Resetar pagina ao mudar filtro
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro]);

  useEffect(() => {
    if (!idPropriedade) return;
    fetchAlertas(paginaAtual);
  }, [idPropriedade, paginaAtual, filtro]);

  const renderItem = ({ item }: { item: Alerta }) => (
    <TouchableOpacity style={styles.card}>
      <View
        style={[
          styles.priorityBar,
          item.prioridade === "ALTA"
            ? { backgroundColor: colors.red.base }
            : { backgroundColor: colors.yellow.warning }
        ]}
      />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.motivo}</Text>
        <Text style={styles.cardDescription}>{item.observacao}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.nicho}</Text>
          </View>

          <View style={styles.dateRow}>
            <CalendarIcon fill={colors.brown.base} size={14} />
            <Text style={styles.dateText}>
              {formatarDataSimples(item.data_alerta)}
            </Text>
          </View>
        </View>

        <View style={styles.resolveRow}>
          <TouchableOpacity
            style={[
              styles.resolveButton,
              item.visto && { backgroundColor: colors.gray.base },
            ]}
            onPress={() => {
              if (!item.visto) {
                setAlertaSelecionado(item);
                setModalVisible(true);
              }
            }}
            disabled={item.visto}
          >
            <Text style={styles.resolveButtonText}>
              {item.visto ? "Já visto" : "Marcar como visto"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 14,
          gap: 20
        }}>
          <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            Confirmar resolução do alerta?
          </Text>

          <Text style={{ textAlign: "center", color: colors.gray.base }}>
            {alertaSelecionado?.motivo}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 10 }}
            >
              <Text style={{ fontWeight: "600" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirmarVisto}
              style={{ backgroundColor: colors.yellow.base, padding: 10, borderRadius: 8 }}
            >
              <Text style={{ fontWeight: "700", color: colors.brown.base }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TextTitle>Alertas ({totalAlertas})</TextTitle>
      <Tabs
        tabs={[
          { key: "TODOS", label: "Todas" },
          { key: "PENDENTES", label: "Não vistas" },
        ]}
        activeTab={filtro}
        onChange={(key) => setFiltro(key as Filtro)}
      />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Text>Carregando Alertas...</Text>
          <ActivityIndicator color={colors.yellow.base} size="large" />
        </View>
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
        <Text style={styles.pageInfo}>Página {paginaAtual} de {totalPaginas}</Text>
        <YellowButton
          title="Próxima"
          onPress={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual >= totalPaginas}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // (seus estilos continuam IGUAIS)
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white.base,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    elevation: 2,
  },
  scrollContent: { paddingBottom: 8 },
  header: { marginBottom: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: colors.white.base,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    overflow: "hidden",
    elevation: 1,
  },
  priorityBar: { 
    width: 5 
  },
  cardContent: { 
    flex: 1, 
    padding: 14 
  },
  cardTitle: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: colors.black.base, 
    marginBottom: 6 
  },
  cardDescription: { 
    fontSize: 13, 
    color: colors.gray.base 
  },
  cardFooter: { 
    marginTop: 12, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  tag: {
    backgroundColor: colors.yellow.base,
    paddingVertical: 4, 
    paddingHorizontal: 10, 
    borderRadius: 10 
  },
  tagText: { 
    fontSize: 11, 
    fontWeight: "600", 
    color: colors.brown.base 
  },
  dateRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4 
  },
  dateText: { 
    fontSize: 12, 
    color: colors.brown.base 
  },
  resolveRow: { 
    marginTop: 12, 
    flexDirection: "row", 
    justifyContent: "flex-end" 
  },
  resolveButton: { 
    backgroundColor: "#22c55e", 
    paddingVertical: 6, 
    paddingHorizontal: 14,
    borderRadius: 8 
  },
  resolveButtonText: { 
    color: "white", 
    fontWeight: "600", 
    fontSize: 13 
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
  loading: {
    alignItems: "center",
    justifyContent: "center",
  }
});
