import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/colors";
import { Modal } from "../Modal";
import Pen from "../../../assets/images/pen.svg";
import { DatePickerModal } from "../DatePickerModal";
import dayjs from "dayjs";


interface SanitarioItem {
    id_sanit: string;
    doenca?: string;
    dosagem?: number;
    dt_aplicacao?: string;
    dt_retorno?: string;
    id_medicao?: string;
    nome_medicamento?: string;
    observacao?: string;
    necessita_retorno?: boolean;
    unidade_medida?: string;
}

interface SanitarioBottomSheetProps {
    item: SanitarioItem;
    onEditSave: (data: SanitarioItem) => void;
    onClose: () => void;
}

export const SanitarioBottomSheet: React.FC<SanitarioBottomSheetProps> = ({ item, onEditSave, onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["70%", "90%"], []);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<SanitarioItem>({ ...item });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    const handleChange = (key: keyof SanitarioItem, value: SanitarioItem[keyof SanitarioItem]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const toggleEdit = () => {
        if (isEditing) {
            console.log("Salvar alterações:", formData);
            onEditSave(formData); 
        }
        setIsEditing(!isEditing);
    };
    
    const handleDelete = () => {
        console.log("Excluir registro:", item.id_sanit);
 
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Nda";
        const parts = dateString.split("T")[0].split("-").reverse();
        return parts.join("/");
    };


return (
  <BottomSheet
    ref={sheetRef}
    index={0}
    snapPoints={snapPoints}
    onChange={handleSheetChange}
    backgroundStyle={{ backgroundColor: "#F8F7F5", borderRadius: 24 }}
    handleIndicatorStyle={{ backgroundColor: "#D1D5DB", height: 4, width: 36 }}
    enablePanDownToClose={true}
        backdropComponent={(props) => (
        <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="none"
        />
    )}
  >
    <BottomSheetScrollView contentContainerStyle={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={{ width: 40 }} />
                    <Text style={styles.headerTitle}>Tratamento Sanitário</Text>
                </View>

                {/* Card Principal */}
                <View style={styles.mainCard}>
                    <View style={styles.cardRow}>
                        <View>
                            <Text style={styles.cardTitle}>
                                Doença: {String(formData.doenca ?? "-")}
                            </Text>
                            <Text style={styles.cardSubtitle}>
                                Aplicado em: {formatDate(formData?.dt_aplicacao)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Detalhes do Tratamento:</Text>

                {/* Lista */}
                <View style={styles.listContainer}>

                    {/* Nome do medicamento */}
                    <View style={styles.listItem}>
                        <Text style={styles.listIcon}>💊</Text>
                        <Text style={styles.listLabel}>Medicação:</Text>

                        {!isEditing ? (
                            <Text style={styles.listValue}>{formData.nome_medicamento ?? "-"}</Text>
                        ) : (
                            <TextInput
                                style={[styles.listValue, styles.inputEditable]}
                                value={formData.nome_medicamento ?? ""}
                                onChangeText={(t) => handleChange("nome_medicamento", t)}
                            />
                        )}
                    </View>

                    {/* Dosagem */}
                    <View style={styles.listItem}>
                        <Text style={styles.listIcon}>🧪</Text>
                        <Text style={styles.listLabel}>Dosagem:</Text>

                        {!isEditing ? (
                            <Text style={styles.listValue}>
                                {String(formData.dosagem ?? "-")} {formData.unidade_medida ?? ""}
                            </Text>
                        ) : (
                            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                                <TextInput
                                    style={[styles.listValue, styles.inputEditable, { minWidth: 40 }]}
                                    keyboardType="numeric"
                                    value={String(formData.dosagem ?? "")}
                                    onChangeText={(t) => handleChange("dosagem", t)}
                                />
                                <TextInput
                                    style={[styles.listValue, styles.inputEditable, { minWidth: 40 }]}
                                    value={formData.unidade_medida ?? ""}
                                    onChangeText={(t) => handleChange("unidade_medida", t)}
                                />
                            </View>
                        )}
                    </View>

                    {/* Necessita retorno */}
                    <View style={styles.listItem}>
                        <Text style={styles.listIcon}>⏳</Text>
                        <Text style={styles.listLabel}>Necessita retorno:</Text>

                        {!isEditing ? (
                            <Text style={styles.listValue}>
                                {formData.necessita_retorno ? "Sim" : "Não"}
                            </Text>
                        ) : (
                            <Switch
                                value={Boolean(formData.necessita_retorno)}
                                onValueChange={(v) => handleChange("necessita_retorno", v)}
                                thumbColor="#FAC638"
                            />
                        )}
                    </View>

                    {/* Retorno (apenas se necessitar) */}
                    {formData.necessita_retorno && (
                      <View style={styles.listItem}>
                        <Text style={styles.listIcon}>📅</Text>
                        <Text style={styles.listLabel}>Retorno:</Text>
                        {!isEditing ? (
                          <Text style={styles.listValue}>{formatDate(formData.dt_retorno)}</Text>
                        ) : (
                          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={[styles.listValue, { color: colors.black.base }]}>
                              {formData.dt_retorno ? formatDate(formData.dt_retorno) : "Selecionar"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    <View style={[styles.listItem, styles.listItemLast]}>
                        <Text style={styles.listIcon}>📝</Text>
                        <Text style={styles.listLabel}>Observação:</Text>

                        {!isEditing ? (
                            <Text style={styles.listValue}>{formData.observacao ?? "-"}</Text>
                        ) : (
                            <TextInput
                                style={[styles.listValue, styles.inputEditable]}
                                value={formData.observacao ?? ""}
                                onChangeText={(t) => handleChange("observacao", t)}
                            />
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    {!isEditing && (
                        <TouchableOpacity
                            style={[styles.footerBtn, styles.deleteBtn]}
                            onPress={handleDelete}
                        >
                            <Text style={styles.deleteText}>Excluir</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.footerBtn, styles.editBtn]}
                        onPress={toggleEdit}
                    >
                        <Text style={styles.editText}>
                            {isEditing ? "Salvar" : "Editar"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <DatePickerModal
                  visible={showDatePicker}
                  date={formData.dt_retorno}
                  onClose={() => setShowDatePicker(false)}
                  onSelectDate={(selected) => {
                    handleChange("dt_retorno", dayjs(selected).format("YYYY-MM-DD"));
                  }}
                />
    </BottomSheetScrollView>
  </BottomSheet>
)};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    backgroundColor: colors.gray.claro,
  },

  handleWrapper: {
    alignItems: "center",
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  mainCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center"
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },

  listContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  listItemLast: {
    borderBottomWidth: 1,
  },
  listIcon: {
    marginRight: 12,
    fontSize: 20,
    color: "#6B7280",
  },
  listLabel: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },
  listValue: {
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    minWidth: 60,
  },

  inputEditable: {
    borderBottomWidth: 1,
    borderColor: "#FAC638",
    paddingBottom: 2,
  },

  highlightBox: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(250,198,56,0.25)",
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A16207",
  },
  highlightValue: {
    fontSize: 14,
    color: "#78350F",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 16,
  },
  footerBtn: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#FAC638",
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "700",
  },
  editText: {
    fontWeight: "700",
    color: "#111827",
  },
radioItem: {
  flexDirection: "row",
  alignItems: "center",
},

radioCircle: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: "#FAC638",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 6,
},

radioSelected: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#FAC638",
},

radioLabel: {
  fontSize: 14,
  color: "#111827",
},
});
