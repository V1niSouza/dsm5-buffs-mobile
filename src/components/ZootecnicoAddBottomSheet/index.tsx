import React, { useCallback, useMemo, useRef, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Animated, // Adicionado para a animação
    Easing // Adicionado para a animação
} from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/colors";
import { DatePickerModal } from "../DatePickerModal";
import dayjs from "dayjs";
import Button from "../Button"; // Assumindo que o Button está disponível

// Tipagem baseada no payload de adição
interface ZootecnicoPayload {
    peso?: number;
    condicao_corporal?: number;
    cor_pelagem?: string;
    formato_chifre?: string;
    porte_corporal?: string;
    dt_registro: string;
    tipo_pesagem?: string;
}

interface ZootecnicoAddBottomSheetProps {
    id_bufalo: string;
    onAddSave: (data: ZootecnicoPayload) => void;
    onClose: () => void;
}

// Dados iniciais para um novo registro
const initialFormData: ZootecnicoPayload = {
    peso: undefined,
    condicao_corporal: undefined,
    cor_pelagem: '',
    formato_chifre: '',
    porte_corporal: '',
    dt_registro: dayjs().format("YYYY-MM-DD"), // Data de registro padrão: hoje
    tipo_pesagem: '',
};

// --- Componente de Input com Floating Label ---
interface FloatingLabelInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const InputWithFloatingLabel: React.FC<FloatingLabelInputProps> = ({
    label,
    value,
    onChangeText,
    keyboardType = "default",
}) => {
    // 1. Estado da Animação: Se tem valor, o label começa flutuando (1), senão, começa dentro (0)
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    // 2. Lógica da Animação
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1, // Mover para a posição flutuante
            duration: 200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(focusAnim, {
                toValue: 0, // Voltar para a posição interna
                duration: 200,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: false,
            }).start();
        }
    };
    
    // Atualiza a animação se o valor mudar (ex: preenchimento automático)
    React.useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: value ? 1 : 0,
            duration: 200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, [value]);


    // 3. Estilos Interpolados
    const labelStyle = {
        // Posição vertical: de 18 (dentro) para -12 (flutuando acima)
        top: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -12],
        }),
        // Tamanho da fonte: de 16 (dentro) para 12 (flutuando acima)
        fontSize: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        // Cor do texto: de cinza (placeholder) para amarelo (focado)
        color: focusAnim.interpolate({
            inputRange: [0, 1],
            // Usando as cores definidas no seu estilo
            outputRange: ["#6B7280", isFocused ? colors.yellow?.base || "#FAC638" : "#6B7280"], 
        }),
    };

    // Cor da Borda do Input Focado
    const borderColor = isFocused ? (colors.yellow.base || "#FAC638") : "#ccc";
    
    return (
        <View style={floatingStyles.inputContainer}>
            <Animated.Text style={[floatingStyles.label, labelStyle]}>
                {label}
            </Animated.Text>
            <TextInput
                style={[styles.input, { borderColor: borderColor, paddingTop: 12 }]}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                onFocus={handleFocus}
                onBlur={handleBlur}
                // O placeholder é tratado pelo Animated.Text, então este deve ser transparente
                placeholderTextColor="transparent"
            />
        </View>
    );
};
// --- Fim Componente de Input com Floating Label ---


export const ZootecnicoAddBottomSheet: React.FC<ZootecnicoAddBottomSheetProps> = ({ id_bufalo, onClose, onAddSave}) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%", "90%"], []);
    
    // Estado do formulário, iniciando com dados padrão
    const [formData, setFormData] = useState<ZootecnicoPayload>({ ...initialFormData });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    const handleChange = (key: keyof ZootecnicoPayload, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // ... (lógica de save permanece a mesma)
        const payloadApi: ZootecnicoPayload = {
            ...formData,
            peso: formData.peso ? Number(formData.peso) : undefined,
            condicao_corporal: formData.condicao_corporal ? Number(formData.condicao_corporal) : undefined,
        };
        
        const cleanedPayload = Object.fromEntries(
            Object.entries(payloadApi).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        ) as ZootecnicoPayload;
        
        onAddSave(cleanedPayload); 
    };
    
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Nda";
        return dayjs(dateString).format("DD/MM/YYYY");
    };


return (
  <BottomSheet
    ref={sheetRef}
    index={0}
    snapPoints={snapPoints}
    onChange={handleSheetChange}
    backgroundStyle={styles.sheetBackground} // Usando estilo definido
    handleIndicatorStyle={styles.handleIndicator} // Usando estilo definido
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
                    <Text style={styles.headerTitle}>Novo Registro Zootécnico</Text>
                </View>


                {/* Lista */}
                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Métricas Corporais</Text>
                    
                        {/* INPUT: Peso (com Floating Label) */}
                        <InputWithFloatingLabel
                            label="Peso (kg)"
                            value={String(formData.peso ?? "")}
                            onChangeText={(t) => handleChange("peso", t)}
                            keyboardType="numeric"
                        />
                    
                    {/* Condição Corporal */}
                        <Text style={styles.listLabel}>Cond. Corporal:</Text>
                        <View style={styles.radioGroupRow}>
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
                    
                    <Text style={styles.sectionTitle}>Caracteristicas Corporais</Text>
                    {/* INPUT: Cor Pelagem (com Floating Label) */}
                        <InputWithFloatingLabel
                            label="Cor Pelagem"
                            value={formData.cor_pelagem ?? ""}
                            onChangeText={(t) => handleChange("cor_pelagem", t)}
                        />

                    {/* INPUT: Formato Chifre (com Floating Label) */}
                        <InputWithFloatingLabel
                            label="Formato Chifre"
                            value={formData.formato_chifre ?? ""}
                            onChangeText={(t) => handleChange("formato_chifre", t)}
                        />

                    {/* INPUT: Porte Corporal (com Floating Label) */}
                        <InputWithFloatingLabel
                            label="Porte Corporal"
                            value={formData.porte_corporal ?? ""}
                            onChangeText={(t) => handleChange("porte_corporal", t)}
                        />
                    
                    <Text style={styles.sectionTitle}>Adicional</Text>
                    {/* INPUT: Tipo Pesagem (com Floating Label) */}
                        <InputWithFloatingLabel
                            label="Tipo Pesagem"
                            value={formData.tipo_pesagem ?? ""}
                            onChangeText={(t) => handleChange("tipo_pesagem", t)}
                        />
                        
                        {/* Data de Registro (Mantido o seu estilo original) */}
                        <View style={styles.dataRegistroContainer}>
                            <Text style={styles.listLabel}>Data Registro:</Text>
                            <TouchableOpacity style={styles.dateDisplayButton} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.listValue}>
                                    {formatDate(formData.dt_registro)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button
                        title="Adicionar Registro"
                        onPress={handleSave}
                    />
                </View>

                <DatePickerModal
                  visible={showDatePicker}
                  date={formData.dt_registro}
                  onClose={() => setShowDatePicker(false)}
                  onSelectDate={(selected) => {
                    handleChange("dt_registro", dayjs(selected).format("YYYY-MM-DD"));
                  }}
                />
    </BottomSheetScrollView>
  </BottomSheet>
)};

// --- Estilos para o Floating Label ---
const floatingStyles = StyleSheet.create({
    inputContainer: {
        marginBottom: 12, // Mantém o espaçamento original do seu input
        paddingTop: 8, // Espaço para o label flutuante
        position: "relative",
    },
    label: {
        position: "absolute",
        left: 12,
        backgroundColor: "#FFFFFF", // Cor do fundo para "cobrir" a borda do input
        paddingHorizontal: 4,
        zIndex: 1,
        fontSize: 14, // Padrão
    },
});

// --- Estilos Originais (com ajustes para compatibilidade) ---
const styles = StyleSheet.create({
  // Novos estilos adicionados para consistência
  sheetBackground: {
    backgroundColor: "#F8F7F5", 
    borderRadius: 24
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB", 
    height: 4, 
    width: 36
  },
  
  // Estilo do container principal
  container: {
    paddingBottom: 32,
    backgroundColor: colors.gray.claro,
    paddingHorizontal: 16, // Adicionado para manter o conteúdo afastado das bordas
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
  sectionTitle: {
    fontWeight: "600", 
    fontSize: 16, 
    marginVertical: 12, // Ajustado para melhor espaçamento
    borderBottomWidth: 1, 
    borderBottomColor: "#eee", 
    paddingBottom: 4 
  },
  listContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16, // Padding interno
    paddingBottom: 8,
    marginHorizontal: 0, // Removido marginHorizontal pois o container já tem
    overflow: "hidden",
  },
  listLabel: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500", // Adicionado para destacar
  },
  listValue: {
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    minWidth: 60,
    fontWeight: "600",
  },
  // Estilo do Input Antigo, agora usado pelo Floating Label
  input: { 
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 6, 
    padding: 12, 
    // Removido marginBottom daqui, é gerenciado pelo inputContainer do FloatingLabel
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 16,
    backgroundColor: "#FFF", // Para evitar que o botão fique na área cinza
    borderRadius: 16,
  },
  // Estilos de Radio Button (Ajustados para melhor visualização)
  radioGroupRow: {
    flexDirection: "row", 
    marginBottom: 12,
    marginTop: 8,
    justifyContent: "space-between",
  },
  radioItem: {
    flexDirection: "row", // Para alinhar círculo e label
    alignItems: "center",
    paddingVertical: 8,
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray.base,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FAC638", // Cor de destaque para o selecionado
  },
  radioLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  dataRegistroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
 dateDisplayButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    backgroundColor: colors.gray.disabled,
 },
});