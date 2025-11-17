import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ToastAndroid, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import bufaloService from "../../services/bufaloService";
import { usePropriedade } from "../../context/PropriedadeContext";
import YellowButton from "../Button"; 
import { colors } from "../../styles/colors";
import { DatePickerModal } from "../DatePickerModal"; // import do seu modal
import dayjs from "dayjs";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface CadastrarBufaloFormProps {
    onClose: () => void;
}

export const CadastrarBufaloForm: React.FC<CadastrarBufaloFormProps> = ({ onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "70%"], []);
    const { propriedadeSelecionada } = usePropriedade();

    const [nome, setNome] = useState("");
    const [brinco, setBrinco] = useState("");
    const [microchip, setMicrochip] = useState("");
    const [dtNascimento, setDtNascimento] = useState<string | undefined>(undefined);
    const [sexo, setSexo] = useState("");
    const [nivelMaturidade, setNivelMaturidade] = useState("");
    const [idRaca, setIdRaca] = useState<number | null>(null);
    const [brincoPai, setBrincoPai] = useState("");
    const [brincoMae, setBrincoMae] = useState("");

    const [racas, setRacas] = useState<any[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [openSexo, setOpenSexo] = useState(false);
    const [openMaturidade, setOpenMaturidade] = useState(false);
    const [openRaca, setOpenRaca] = useState(false);

    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        const fetchRacas = async () => {
        try {
            const racasApi = await bufaloService.getRacas();
            setRacas(racasApi);
        } catch (err) {
            console.error("Erro ao buscar raças:", err);
        }
        };
        fetchRacas();
    }, []);

    const showToast = (message: string, isError: boolean = false) => {
        if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
        Alert.alert(isError ? "Erro" : "Sucesso", message);
        }
    };

    const handleSave = async () => {
        if (!propriedadeSelecionada) {
        showToast("Selecione uma propriedade antes de cadastrar.", true);
        return;
        }

        try {
        let idPai: number | null = null;
        if (brincoPai) {
            const paiEncontrado = await bufaloService.getBufaloByBrincoAndSexo(
            propriedadeSelecionada, brincoPai, "M"
            );
            if (!paiEncontrado) {
            showToast("Nenhum pai encontrado com esse brinco (Macho) na propriedade.", true);
            return;
            }
            idPai = paiEncontrado.id || paiEncontrado.id_bufalo;
        }

        let idMae: number | null = null;
        if (brincoMae) {
            const maeEncontrada = await bufaloService.getBufaloByBrincoAndSexo(
            propriedadeSelecionada, brincoMae, "F"
            );
            if (!maeEncontrada) {
            showToast("Nenhuma mãe encontrada com esse brinco (Fêmea) na propriedade.", true);
            return;
            }
            idMae = maeEncontrada.id || maeEncontrada.id_bufalo;
        }

        const payload = {
            nome,
            brinco,
            microchip,
            dt_nascimento: dtNascimento,
            sexo,
            nivel_maturidade: nivelMaturidade,
            id_raca: idRaca,
            id_pai: idPai,
            id_mae: idMae,
            status: true,
            categoria: "PA",
            id_propriedade: propriedadeSelecionada,
        };

        await bufaloService.createBufalo(payload);
        showToast("Búfalo cadastrado com sucesso!");
        } catch (err) {
        console.error("Erro ao salvar búfalo:", err);
        showToast("Não foi possível salvar o búfalo.", true);
        }
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
        <View style={styles.container}>
        <Text style={styles.sectionTitle}>Dados Básicos</Text>
        <TextInput style={styles.inputFull} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.inputFull} placeholder="Brinco" value={brinco} onChangeText={setBrinco} />
        <TextInput style={styles.inputFull} placeholder="Microchip" value={microchip} onChangeText={setMicrochip} />

        <Text style={styles.sectionTitle}>Características</Text>
        <View style={styles.row}>
            <DropDownPicker
            open={openSexo}
            setOpen={setOpenSexo}
            value={sexo}
            setValue={setSexo}
            items={[
                { label: "Macho", value: "M" },
                { label: "Fêmea", value: "F" },
            ]}
            placeholder="Sexo"
            containerStyle={{ flex: 1, marginRight: 8 }}
            listMode="SCROLLVIEW"
            zIndex={5000}
            />
            <DropDownPicker
            open={openMaturidade}
            setOpen={setOpenMaturidade}
            value={nivelMaturidade}
            setValue={setNivelMaturidade}
            items={[
                { label: "Bezerro (B)", value: "B" },
                { label: "Novilha (N)", value: "N" },
                { label: "Vaca (V)", value: "V" },
                { label: "Touro (T)", value: "T" },
            ]}
            placeholder="Maturidade"
            containerStyle={{ flex: 1, marginLeft: 8 }}
            listMode="SCROLLVIEW"
            zIndex={4000}
            />
        </View>

        <Text style={styles.sectionTitle}>Data de Nascimento</Text>
        <TouchableOpacity style={styles.inputFull} onPress={() => setShowDatePicker(true)}>
            <Text>{dtNascimento ? dayjs(dtNascimento).format("YYYY-MM-DD") : "Selecione a Data"}</Text>
        </TouchableOpacity>

        <DatePickerModal
            visible={showDatePicker}
            date={dtNascimento}
            onClose={() => setShowDatePicker(false)}
            onSelectDate={(selected) => setDtNascimento(dayjs(selected).format("YYYY-MM-DD"))}
        />

        <Text style={styles.sectionTitle}>Raça</Text>
        <DropDownPicker
            open={openRaca}
            setOpen={setOpenRaca}
            value={idRaca}
            setValue={setIdRaca}
            items={racas.map(r => ({ label: r.nome, value: r.id_raca }))}
            placeholder="Selecione Raça"
            containerStyle={{ marginBottom: 12 }}
            listMode="SCROLLVIEW"
            zIndex={3000}
        />

        <Text style={styles.sectionTitle}>Parentesco</Text>
        <View style={styles.row}>
            <TextInput style={{ ...styles.inputFull, flex: 1, marginRight: 8 }} placeholder="Brinco do Pai" value={brincoPai} onChangeText={setBrincoPai} />
            <TextInput style={{ ...styles.inputFull, flex: 1, marginLeft: 8 }} placeholder="Brinco da Mãe" value={brincoMae} onChangeText={setBrincoMae} />
        </View>

        <YellowButton title="Salvar" onPress={handleSave} />
        </View>
    </BottomSheetScrollView>
  </BottomSheet>
    );
    };

const styles = StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 4 },
    inputFull: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
});
