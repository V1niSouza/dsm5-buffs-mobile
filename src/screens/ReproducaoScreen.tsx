import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { colors } from '../styles/colors';
import Plus from '../../assets/images/plus.svg';
import { getReproducoes } from '../services/reproducaoService';
import { Modal } from '../components/Modal';
import { FormReproducaoAtt } from '../components/FormReproductionAtt';
import { FormReproducaoAdd } from '../components/FormReproductionAdd';
import DashReproduction from '../components/DashReproducao';
import { CardReproducao } from '../components/CardBufaloReproduction';
import Button from '../components/Button';

export const ReproducaoScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [reproducoes, setReproducoes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reproducaoSelecionada, setReproducaoSelecionada] = useState<any>(null);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 10;

  const fetchReproducoes = async () => {
    setRefreshing(true);
    try {
      const data = await getReproducoes('e7625c27-da8d-4ffa-a514-0c191b1fb1e3');
      setReproducoes(data);
      setTotalPaginas(Math.ceil(data.length / itensPorPagina));
      setPaginaAtual(1); // resetar página sempre que atualizar dados
    } catch (error) {
      console.error(error);
      setReproducoes([]);
      setTotalPaginas(1);
      setPaginaAtual(1);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReproducoes();
  }, []);

  const onRefresh = async () => {
    await fetchReproducoes();
  };

  const handleCardPress = (reproducao: any) => {
    setReproducaoSelecionada(reproducao);
    setModalVisible(true);
  };

  // Lista paginada
  const reproducoesPaginadas = reproducoes.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header1Text}>Reprodução</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => {
              setReproducaoSelecionada(null);
              setModalVisible(true);
            }}
            style={styles.button}
          >
            <Plus width={15} height={15} style={{ margin: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <MainLayout>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <DashReproduction
            emProcesso={reproducoes.length > 0 ? reproducoes.filter(r => r.status === 'Em andamento').length : 0}
            confirmadas={reproducoes.length > 0 ? reproducoes.filter(r => r.status === 'Confirmada').length : 0}
            falhas={reproducoes.length > 0 ? reproducoes.filter(r => r.status === 'Falha').length : 0}
            ultimaData={reproducoes.length > 0 ? reproducoes[0].dt_evento : "-"}
          />

          <View style={styles.content}>
            {reproducoesPaginadas.map(reproducao => (
              <CardReproducao
                key={reproducao.id}
                reproducao={{
                  brincoBufala: reproducao.brincoVaca,
                  brincoTouro: reproducao.brincoTouro,
                  tipoReproducao: reproducao.tipoInseminacao,
                  concluida: reproducao.tipoParto,
                  dataCruzamento: reproducao.dt_evento,
                  previsaoParto: reproducao.previsaoParto,
                  status: reproducao.status,
                  tipo_parto: reproducao.tipoParto,
                  tipo_inseminacao: reproducao.tipoInseminacao,
                  id_semen: reproducao.id_semen,
                }}
                onPress={() => handleCardPress(reproducao)}
              />
            ))}

            {totalPaginas > 1 && (
              <View style={styles.pagination}>
                <Button
                  title="Anterior"
                  onPress={() => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                />
                <Text style={styles.pageInfo}>
                  Página {paginaAtual} de {totalPaginas}
                </Text>
                <Button
                  title="Próxima"
                  onPress={() => paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </MainLayout>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        {reproducaoSelecionada ? (
          <FormReproducaoAtt
            initialData={reproducaoSelecionada}
            onClose={() => setModalVisible(false)}
            onSuccess={fetchReproducoes}
          />
        ) : (
          <FormReproducaoAdd
            onClose={() => setModalVisible(false)}
            onSuccess={fetchReproducoes}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 80,
    backgroundColor: colors.yellow.base,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
  header1Text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    color: colors.brown.base
  },
  headerButtons: {
    marginTop: 25,
    flexDirection: "row",
    position: "absolute",
    right: 20,
    gap: 20
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginBottom: 50,
    borderColor: colors.gray.disabled
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  pageInfo: {
    marginHorizontal: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});
