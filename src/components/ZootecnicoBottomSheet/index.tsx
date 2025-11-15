import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/colors";
import Pen from "../../../assets/images/pen.svg";

interface ZootecnicoItem {
    id_zootec: string;
    tipo_pesagem?: string;
    dt_registro?: string;
    peso?: number;
    condicao_corporal?: number;
    cor_pelagem?: string;
    formato_chifre?: string;
    porte_corporal?: string;
    retorno?: boolean;
    dt_retorno?: string;
}

interface ZootecnicoBottomSheetProps {
    item: ZootecnicoItem;
    onEditSave: (data: ZootecnicoItem) => void;
    onClose: () => void;
}

export const ZootecnicoBottomSheet: React.FC<ZootecnicoBottomSheetProps> = ({ item, onEditSave, onClose }) => {

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["70%", "90%"], []);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ZootecnicoItem>({ ...item });



    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    const handleChange = (key: keyof ZootecnicoItem, value: string) => {
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
        console.log("Excluir registro:", item.id_zootec);
 
    };

    const formatDate = (dateString?: string) => {
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
        <Text style={styles.headerTitle}>Detalhes do Evento</Text>
      </View>

      {/* Card Principal */}
      <View style={styles.mainCard}>
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.cardTitle}>
              Registro {String(formData.tipo_pesagem ?? "")}
            </Text>
            <Text style={styles.cardSubtitle}>
              Data do Registro: {formatDate(formData?.dt_registro)}
            </Text>
          </View>
        </View>
      </View>

      {/* Título da seção */}
      <Text style={styles.sectionTitle}>Detalhes do Animal</Text>

      {/* Lista */}
{/* Lista */}
<View style={styles.listContainer}>
    
    {/* Peso */}
    <View style={styles.listItem}>
      <Text style={styles.listIcon}>⚖️</Text>
      <Text style={styles.listLabel}>Peso</Text>

      {!isEditing ? (
        <Text style={styles.listValue}>{String(formData.peso ?? "-")}</Text>
      ) : (
        <TextInput
          style={[styles.listValue, styles.inputEditable]}
          keyboardType="numeric"
          value={String(formData.peso ?? "")}
          onChangeText={(t) => handleChange("peso", t)}
        />
      )}
    </View>

    {/* Condição Corporal (ECC) — RADIO BOX */}
    <View style={styles.listItem}>
      <Text style={styles.listIcon}>🙂</Text>
      <Text style={styles.listLabel}>Condição Corporal (ECC)</Text>

      {!isEditing ? (
        <Text style={styles.listValue}>
          {String(formData.condicao_corporal ?? "-")}
        </Text>
      ) : (
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => handleChange("condicao_corporal", String(n))}
              style={styles.radioItem}
            >
              <View style={styles.radioCircle}>
                {String(formData.condicao_corporal) === String(n) && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>

    {/* Pelagem */}
    <View style={styles.listItem}>
      <Text style={styles.listIcon}>🎨</Text>
      <Text style={styles.listLabel}>Pelagem</Text>

      {!isEditing ? (
        <Text style={styles.listValue}>{formData.cor_pelagem ?? "-"}</Text>
      ) : (
        <TextInput
          style={[styles.listValue, styles.inputEditable]}
          value={formData.cor_pelagem ?? ""}
          onChangeText={(t) => handleChange("cor_pelagem", t)}
        />
      )}
    </View>

    {/* Formato Chifre */}
    <View style={styles.listItem}>
      <Text style={styles.listIcon}>🐮</Text>
      <Text style={styles.listLabel}>Chifre</Text>

      {!isEditing ? (
        <Text style={styles.listValue}>{formData.formato_chifre ?? "-"}</Text>
      ) : (
        <TextInput
          style={[styles.listValue, styles.inputEditable]}
          value={formData.formato_chifre ?? ""}
          onChangeText={(t) => handleChange("formato_chifre", t)}
        />
      )}
    </View>

    {/* Porte Corporal */}
    <View style={[styles.listItem, styles.listItemLast]}>
      <Text style={styles.listIcon}>📏</Text>
      <Text style={styles.listLabel}>Porte</Text>

      {!isEditing ? (
        <Text style={styles.listValue}>{formData.porte_corporal ?? "-"}</Text>
      ) : (
        <TextInput
          style={[styles.listValue, styles.inputEditable]}
          value={formData.porte_corporal ?? ""}
          onChangeText={(t) => handleChange("porte_corporal", t)}
        />
      )}
    </View>
</View>


      {/* Campo Destaque: Data de retorno */}
      {Boolean(formData.retorno) && (
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Data de Retorno</Text>
          <Text style={styles.highlightValue}>
            {String(formData.dt_retorno ?? "-")}
          </Text>
        </View>
      )}

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
            {isEditing ? "Salvar Alterações" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>
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
