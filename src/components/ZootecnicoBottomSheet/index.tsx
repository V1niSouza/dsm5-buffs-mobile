import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/colors";
import Pen from "../../../assets/images/pen.svg";

// Definição de Tipos para melhor clareza
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
    // Adicione outros campos necessários aqui
}

interface ZootecnicoBottomSheetProps {
    item: ZootecnicoItem;
    // onEditSave é a função para salvar os dados editados
    onEditSave: (data: ZootecnicoItem) => void;
    // onClose é chamado quando o usuário arrasta para fechar ou a ação é concluída
    onClose: () => void;
}

export const ZootecnicoBottomSheet: React.FC<ZootecnicoBottomSheetProps> = ({ item, onEditSave, onClose }) => {
    // Não precisamos checar "if (!item) return null" aqui, pois o componente pai faz isso (visible={!!item}).

    const sheetRef = useRef<BottomSheet>(null);
    // Snap points definidos para a abertura imediata no primeiro ponto
    const snapPoints = useMemo(() => ["50%", "90%"], []);
    
    const [isEditing, setIsEditing] = useState(false);
    // Inicializa o estado com o item recebido
    const [formData, setFormData] = useState<ZootecnicoItem>({ ...item });

    // O BottomSheet deve abrir automaticamente no índice 0 ao ser montado.
    // O index={0} garante a abertura imediata.

    const handleSheetChange = useCallback((index: number) => {
        // Se o BottomSheet for fechado (index === -1), chama o onClose do pai.
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
            onEditSave(formData); // Chama a função de salvamento do pai
        }
        setIsEditing(!isEditing);
    };
    
    const handleDelete = () => {
        console.log("Excluir registro:", item.id_zootec);
        // Implemente a lógica de exclusão e chame onClose() após a exclusão
        // onClose(); 
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Nda";
        const parts = dateString.split("T")[0].split("-").reverse();
        return parts.join("/");
    };

    return (
        <BottomSheet
            ref={sheetRef}
            // 🚨 Index inicial: 0. Garante que ele apareça na montagem.
            index={0}
            snapPoints={snapPoints}
            // Fecha o estado pai quando arrastado para baixo
            onChange={handleSheetChange}
            backgroundStyle={{ backgroundColor: "#F8F7F5", borderRadius: 24 }}
            handleIndicatorStyle={{ backgroundColor: colors.yellow.base }}
            // Adicionado para evitar que o componente desapareça se o index for < 0
            enablePanDownToClose={true} 
        >
            <BottomSheetScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Detalhes do Evento</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.card}>
                    <View style={styles.centerBlock}>
                        <Text style={styles.label}>
                            Registro {String(formData.tipo_pesagem ?? "")}
                        </Text>
                        <Text style={styles.date}>
                            {formatDate(formData?.dt_registro)}
                        </Text>
                    </View>

                    {/* Linhas de dados */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Peso (Kg)</Text>
                            <TextInput
                                style={[styles.value, isEditing && styles.inputEditable]}
                                editable={isEditing}
                                keyboardType="numeric"
                                // Use String() para garantir que o valor seja uma string (obrigatório para TextInput)
                                value={String(formData.peso ?? "")} 
                                onChangeText={(t) => handleChange("peso", t)}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Condição Corporal</Text>
                            <TextInput
                                style={[styles.value, isEditing && styles.inputEditable]}
                                editable={isEditing}
                                keyboardType="numeric"
                                value={String(formData.condicao_corporal ?? "")}
                                onChangeText={(t) => handleChange("condicao_corporal", t)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Cor Pelagem</Text>
                            <TextInput
                                style={[styles.value, isEditing && styles.inputEditable]}
                                editable={isEditing}
                                value={formData.cor_pelagem ?? ""}
                                onChangeText={(t) => handleChange("cor_pelagem", t)}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Formato Chifre</Text>
                            <TextInput
                                style={[styles.value, isEditing && styles.inputEditable]}
                                editable={isEditing}
                                value={formData.formato_chifre ?? ""}
                                onChangeText={(t) => handleChange("formato_chifre", t)}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Porte Corporal</Text>
                            <TextInput
                                style={[styles.value, isEditing && styles.inputEditable]}
                                editable={isEditing}
                                value={formData.porte_corporal ?? ""}
                                onChangeText={(t) => handleChange("porte_corporal", t)}
                            />
                        </View>
                    </View>

                    {Boolean(formData.retorno) && (
                        <View style={styles.infoBlock}>
                            <Text style={styles.label}>Data de Retorno</Text>
                            {/* Assumindo que dt_retorno já está formatado, ou aplique formatDate */}
                            <Text style={styles.value}>
                                {String(formData.dt_retorno ?? "-")}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Rodapé */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={toggleEdit}
                    >
                        <Pen width={25} height={25} />
                        <Text style={styles.editText}>
                            {isEditing ? "Salvar Alterações" : "Editar Registro"}
                        </Text>
                    </TouchableOpacity>
                    {!isEditing && (
                        <TouchableOpacity 
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDelete} // Nova ação de delete
                        >
                            <Text style={styles.deleteText}>Excluir Registro</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

// ... Styles (mantidos do original para o design)
const styles = StyleSheet.create({
    content: {
        padding: 16,
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.brown.base,
        marginBottom: 12,
    },
    row: { marginBottom: 12, flexDirection: "row", justifyContent: 'space-between' },
    label: { fontSize: 12, color: "#6B7280" },
    value: { fontSize: 16, color: "#111" },
    inputEditable: {
        borderBottomWidth: 1,
        borderColor: colors.yellow.base,
        paddingVertical: 2, 
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 48,
        borderRadius: 24,
    },
    editButton: {
        backgroundColor: colors.yellow.base,
    },
    deleteButton: {
        borderWidth: 1,
        borderColor: "#EF4444",
    },
    editText: {
        fontWeight: "700",
        fontSize: 16,
        color: colors.brown.base,
        marginLeft: 6,
    },
    deleteText: {
        fontWeight: "700",
        fontSize: 16,
        color: "#EF4444",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
    },
    modal: {
        backgroundColor: "#F8F7F5",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "95%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A202C",
    },
    backButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 16,
    },
    centerBlock: { alignItems: "center", marginBottom: 8 },
    date: { fontSize: 22, fontWeight: "700", color: colors.yellow.dark },
    col: { 
        flex: 1, 
        marginHorizontal: 4, 
    }, 
    infoBlock: { marginBottom: 8 },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        gap: 12,
    }
});