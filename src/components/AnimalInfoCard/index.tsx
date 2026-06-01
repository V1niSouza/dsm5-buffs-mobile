import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import { colors } from "../../styles/colors";

import bufaloService from "../../services/bufaloService";

import Pen from "../../../assets/images/pen.svg";

import { ConfirmModal } from "../ModalStatus";

import { formatarDataBR } from "../../utils/date";

import SelectBottomSheet from "../SelectBottomSheet";
import { useTranslation } from "react-i18next";

interface Grupo {
  id: string;
  nome: string;
  color: string;
}

export const AnimalInfoCard = ({
  detalhes,
  onEdit,
  onRefresh,
}: {
  detalhes: any;
  onEdit: () => void;
  onRefresh: () => void;
}) => {
  const { t } = useTranslation("animalDetail");
  const maturidadeMap: Record<
    string,
    string
  > = {
    B: t("card.maturityLabels.B"),
    N: t("card.maturityLabels.N"),
    T: t("card.maturityLabels.T"),
    V: t("card.maturityLabels.V"),
  };

  const maturidadeTexto =
    maturidadeMap[
      detalhes.nivelMaturidade
    ] || detalhes.nivelMaturidade;

  const [isEnabled, setIsEnabled] =
    useState(
      Boolean(detalhes?.status)
    );

  const [modalVisible, setModalVisible] =
    useState(false);

  const [novoStatus, setNovoStatus] =
    useState<boolean | null>(null);

  const [grupos, setGrupos] =
    useState<Grupo[]>([]);

  const [
    grupoAtualId,
    setGrupoAtualId,
  ] = useState<string | null>(
    detalhes?.idGrupo ?? null
  );

  const [
    novoGrupoSelecionado,
    setNovoGrupoSelecionado,
  ] = useState<string | null>(
    detalhes?.idGrupo ?? null
  );

  const [
    modalMudarGrupoVisible,
    setModalMudarGrupoVisible,
  ] = useState(false);

  const [
    idGrupoParaMudar,
    setIdGrupoParaMudar,
  ] = useState<string | null>(
    null
  );

  const [
    nomeGrupoParaMudar,
    setNomeGrupoParaMudar,
  ] = useState("");

  const toggleSwitch = () => {
    const valorPretendido =
      !isEnabled;

    setNovoStatus(
      valorPretendido
    );

    setModalVisible(true);
  };

  useEffect(() => {
    const fetchGrupos =
      async () => {
        try {
          const idPropriedade =
            detalhes.idPropriedade;

          if (idPropriedade) {
            const gruposApi =
              await bufaloService.getGrupos(
                idPropriedade
              );

            setGrupos(gruposApi);
          }
        } catch (err) {
          console.error(
            "Erro ao buscar grupos:",
            err
          );
        }
      };

    fetchGrupos();
  }, [detalhes.idPropriedade]);

  const confirmarMudancaGrupo =
    useCallback(async () => {
      setModalMudarGrupoVisible(
        false
      );

      if (
        idGrupoParaMudar === null
      )
        return;

      try {
        await bufaloService.moverBufaloDeGrupo(
          detalhes.idBufalo,
          idGrupoParaMudar
        );

        setGrupoAtualId(
          idGrupoParaMudar
        );

        setNovoGrupoSelecionado(
          idGrupoParaMudar
        );

        Alert.alert(
          t("card.alertSuccess"),
          t("card.movedSuccess", { nome: nomeGrupoParaMudar })
        );

        onRefresh();
      } catch (error) {
        console.error(
          "Erro ao alterar grupo:",
          error
        );

        Alert.alert(
          t("card.alertError"),
          t("card.changeGroupError")
        );

        setNovoGrupoSelecionado(
          grupoAtualId
        );
      } finally {
        setIdGrupoParaMudar(
          null
        );

        setNomeGrupoParaMudar("");
      }
    }, [
      detalhes.idBufalo,
      idGrupoParaMudar,
      nomeGrupoParaMudar,
      grupoAtualId,
    ]);

  const handleMudarGrupo =
    useCallback(
      async (idGrupo: string) => {
        if (
          idGrupo === grupoAtualId
        )
          return;

        const novoNomeGrupo =
          grupos.find(
            (g) => g.id === idGrupo
          )?.nome ||
          t("card.selectedGroupFallback");

        setIdGrupoParaMudar(
          idGrupo
        );

        setNomeGrupoParaMudar(
          novoNomeGrupo
        );

        setModalMudarGrupoVisible(
          true
        );

        setNovoGrupoSelecionado(
          grupoAtualId
        );
      },
      [grupoAtualId, grupos]
    );

  const grupoItems =
    useMemo(() => {
      return grupos.map((g) => ({
        label: g.nome,
        value: g.id,
      }));
    }, [grupos]);

  const confirmarAlteracaoStatus =
    async () => {
      if (novoStatus === null)
        return;

      try {
        await bufaloService.updateBufalo(
          detalhes.idBufalo,
          {
            status: novoStatus,
          }
        );

        setIsEnabled(novoStatus);
        onRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        setModalVisible(false);
      }
    };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View
              style={styles.nameRow}
            >
              <Text
                style={styles.name}
              >
                {detalhes?.nome ||
                  t("card.noName")}
              </Text>

              {detalhes?.categoria && (
                <View
                  style={
                    styles.categoryBadge
                  }
                >
                  <Text
                    style={
                      styles.categoryText
                    }
                  >
                    {
                      detalhes.categoria
                    }
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={
                styles.brinco
              }
            >
              {t("card.tagLabel")}{" "}
              {detalhes?.brinco ||
                "-"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onEdit}
            style={
              styles.editButton
            }
          >
            <Pen
              width={18}
              height={18}
              fill={
                colors.text.accent
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View
            style={
              styles.statusLeft
            }
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    isEnabled
                      ? colors
                          .status
                          .success
                      : colors
                          .status
                          .error,
                },
              ]}
            />

            <Text
              style={
                styles.statusText
              }
            >
              {isEnabled
                ? t("card.active")
                : t("card.inactive")}
            </Text>
          </View>

          <Switch
            trackColor={{
              false:
                colors.border
                  .default,
              true:
                colors.status
                  .successBg,
            }}
            thumbColor={
              isEnabled
                ? colors
                    .status
                    .success
                : colors
                    .status
                    .error
            }
            onValueChange={
              toggleSwitch
            }
            value={isEnabled}
          />
        </View>

        <View style={styles.grid}>
            <Text style={styles.sectionTitle}>
              {t("card.baseData")}</Text>
          <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.infoCard}>
              <Text style={styles.label}>
                {t("card.birth")}</Text>

              <Text style={styles.value}>
                {formatarDataBR(
                  detalhes?.dtNascimento
                )}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>
                {t("card.sex")}</Text>

              <Text style={styles.value}>
                {detalhes?.sexo === "F"? t("card.female") : t("card.male")}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.infoCard}>
              <Text style={styles.label}>
                {t("card.breed")}</Text>

              <Text style={styles.value}>
                {detalhes?.racaNome || "-"}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>
                {t("card.maturity")}</Text>

              <Text style={styles.value}>
                {maturidadeTexto ||
                  "-"}
              </Text>
            </View>
          </View>
        </View>
            <Text style={styles.sectionTitle}>
              {t("card.lineage")}</Text>
          <View style={styles.section}>

            <View style={styles.row}>
              <View style={styles.infoCard}>
                <Text style={styles.label}>
                  {t("card.father")}</Text>

                <Text style={styles.value}>
                  {detalhes?.paiNome || "-"}
                </Text>
              </View>

              <View style={ styles.infoCard}>
                <Text style={styles.label}>
                  {t("card.mother")}</Text>

                <Text style={styles.value}>
                  {detalhes?.maeNome || "-"}
                </Text>
              </View>
            </View>
          </View>

            <Text style={styles.sectionTitle}>
              {t("card.currentGroup")}</Text>
          <View style={styles.section}>
            <View style={styles.groupContainer}>
              <SelectBottomSheet
                items={grupoItems}
                value={
                  novoGrupoSelecionado
                }
                onChange={
                  handleMudarGrupo
                }
                title={t("card.selectGroup")}
                placeholder={
                  detalhes?.grupo
                    ?.nomeGrupo ||
                  t("card.noGroup")
                }
              />
            </View>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
              {t("card.location")} {" "} {detalhes?.coords?.nome || "-"}
            </Text>
          </View>
          </View>
        </View>
      </View>

      <ConfirmModal
        visible={
          modalMudarGrupoVisible
        }
        title={t("card.confirmGroupTitle")}
        message={t("card.confirmGroupMessage", { nome: nomeGrupoParaMudar })}
        onConfirm={
          confirmarMudancaGrupo
        }
        onCancel={() => {
          setModalMudarGrupoVisible(
            false
          );

          setNovoGrupoSelecionado(
            grupoAtualId
          );
        }}
        confirmText={t("card.move")}
      />

      <ConfirmModal
        visible={modalVisible}
        title={t("card.statusTitle")}
        message={t("card.statusMessage", { status: novoStatus ? t("card.statusActive") : t("card.statusInactive") })}
        onConfirm={
          confirmarAlteracaoStatus
        }
        onCancel={() =>
          setModalVisible(false)
        }
        confirmText={
          novoStatus
            ? t("card.activate")
            : t("card.deactivate")
        }
        variant={
          novoStatus
            ? "success"
            : "danger"
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.title,
  },

  brinco: {
    marginTop: 3,
    fontSize: 13,
    color: colors.text.muted,
  },

  categoryBadge: {
    backgroundColor: colors.status.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.bg.section,
    justifyContent: "center",
    alignItems: "center",
  },

  statusCard: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.bg.section,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.accent,
  },

  grid: {
    marginTop: 16,
    gap: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  infoCard: {
    flex: 1,
    padding: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.muted,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.accent,
  },

  section: {
    backgroundColor: colors.bg.section,
    borderRadius: 14,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.accent,
  },

  groupContainer: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  locationBadge: {
    alignSelf: "center",
    paddingHorizontal: 12,
    marginBottom: 10
  },

  locationText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text.accent,
  },
});