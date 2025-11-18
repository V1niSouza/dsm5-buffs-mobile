import React, { useState, useRef, useMemo, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import YellowButton from "../Button";
import { colors } from "../../styles/colors";
import { MapLeaflet } from "../Mapa"; 
import { Piquete } from "../../services/piqueteService"; 
import { useGpsLocation } from "../../hooks/useLocation";


interface DemarcacaoPiquete extends Omit<Piquete, 'id' | 'color'> {
    coords: { latitude: number; longitude: number }[];
}

interface DemarcacaoPiqueteSheetProps {
    onClose: () => void;
}

export const DemarcacaoPiqueteSheet: React.FC<DemarcacaoPiqueteSheetProps> = ({ onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["70%", "95%"], []);

    const [nomePiquete, setNomePiquete] = useState("");
    const [demarcacaoCoords, setDemarcacaoCoords] = useState<{ latitude: number; longitude: number }[]>([]);
    const { location: currentLocation, loading: gpsLoading, error: gpsError } = useGpsLocation();
    const simulatedColorId = 'blue'; 

    const handleSheetChange = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    const showToast = (message: string, isError: boolean = false) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert(isError ? "Erro" : "Sucesso", message);
        }
    };
    
    const handleAddPoint = () => {
            if (gpsLoading) {
                showToast("Aguarde, o GPS ainda está carregando...", true);
                return;
            }
            
            if (currentLocation) {
                setDemarcacaoCoords(prev => [...prev, currentLocation]);
                showToast(`Ponto (${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}) adicionado!`, false);
            } else {
                showToast(gpsError || "Não foi possível obter a localização atual.", true);
            }
    };

    const handleSaveDemarcacao = () => {
        if (!nomePiquete) {
            showToast("Informe o nome do piquete.", true);
            return;
        }
        if (demarcacaoCoords.length < 3) {
            showToast("É preciso de pelo menos 3 pontos para demarcar uma área.", true);
            return;
        }

        const novoPiquete = {
            nome: nomePiquete,
            coords: demarcacaoCoords,
            grupoCor: simulatedColorId,
        };
        showToast("Piquete demarcardo com sucesso!");
        onClose(); 
    };
    
    const handleClearDemarcacao = () => {
        setDemarcacaoCoords([]);
        showToast("Demarcação limpa.", false);
    };

    const mapPiquetes = useMemo(() => {
        return [{ 
            id: 'current', 
            coords: demarcacaoCoords, 
            nome: nomePiquete || 'Em Demarcação',
            grupoCor: simulatedColorId,
            grupoNome: 'Demarcando',
            color: simulatedColorId,
        } as Piquete];
    }, [demarcacaoCoords, nomePiquete]);

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
                    pressBehavior="close" 
                />)}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.title}>Demarcação de Nova Área/Piquete</Text>
                </View>

                <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        
                        <View style={styles.mapContainer}>
                                <MapLeaflet
                                    piquetes={mapPiquetes}
                                    currentLocation={currentLocation} 
                                />
                        </View>
                        
                        <Text style={styles.sectionTitle}>Pontos Demarcados: {demarcacaoCoords.length}</Text>
                        {gpsError && <Text style={{ color: 'red', marginBottom: 8 }}>Erro GPS: {gpsError}</Text>}

                        <View style={styles.row}>
                            <TouchableOpacity 
                                style={styles.actionButton} 
                                onPress={handleAddPoint}
                                disabled={gpsLoading || !currentLocation} 
                            >
                                <Text style={styles.actionButtonText}>
                                    {gpsLoading ? 'Aguarde o GPS...' : 'Adicionar Ponto (GPS)'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </BottomSheetScrollView>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    mapLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray.disabled
    },
    header: { 
        padding: 16,
        borderBottomWidth: 1, borderBottomColor: "#eee" },
    title: { fontWeight: "bold", fontSize: 18, textAlign: "center", color: colors.brown.base },
    scrollContent: { flexGrow: 1, paddingBottom: 50 },
    formContainer: { padding: 16 },
    sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 8, color: colors.gray.base },
    hintText: { fontSize: 12, color: colors.gray.base, marginBottom: 8 },
    inputFull: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 },
    mapContainer: { height: 300, width: '100%', marginBottom: 16, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray.disabled },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, gap: 10 },
    actionButton: { flex: 2, backgroundColor: colors.yellow.base, borderRadius: 6, padding: 12, alignItems: 'center' },
    clearButton: { flex: 1, backgroundColor: colors.brown.base, borderRadius: 6, padding: 12, alignItems: 'center' },
    actionButtonText: { color: colors.brown.base, fontWeight: 'bold' } // Corrigi para uma cor que apareça no botão marrom/amarelo
});