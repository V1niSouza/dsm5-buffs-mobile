import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button'; 
import { colors } from '../styles/colors'; 
import bufaloService from '../services/bufaloService';
import { usePropriedade } from '../context/PropriedadeContext';
import { useTranslation } from 'react-i18next';


type RootStackParamList = {
  NfcScannerScreen: undefined;
  AnimalDetail: { id: string };
};

export const NfcScannerScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { propriedadeSelecionada } = usePropriedade();
    const { t } = useTranslation("nfc");

    const [lidas, setLidas] = useState<string[]>([]);
    const [statusText, setStatusText] = useState(t("starting"));
    
    const isScanningRef = useRef(false);

    const finalizarScanner = () => {
        isScanningRef.current = false;
        try {
            NfcManager.cancelTechnologyRequest();
        } catch (e) {
            console.log("Erro ao limpar requisição NFC:", e);
        }
            navigation.goBack(); 
    };

    const lerProximaTag = async () => {
        if (!isScanningRef.current) return; 

        try {
            setStatusText(t("approach"));
            
            await NfcManager.requestTechnology(NfcTech.NfcA);
            const tag = await NfcManager.getTag();
            
            if (tag?.id) {
                const microchip = tag.id.toUpperCase();
                console.log(`✅ TAG CAPTURADA: ${microchip}`);
                setStatusText(t("reading", { microchip }));
                try {
                    const bufalo = await bufaloService.getBufaloPorMicrochip(microchip);

                    await NfcManager.cancelTechnologyRequest();
                    isScanningRef.current = false; 
                    
                    const bufaloId = bufalo?.id ?? bufalo?.idBufalo;
                    if (bufalo && bufaloId) {
                        setStatusText(t("found"));

                        navigation.replace("AnimalDetail", { id: bufaloId });
                        return; 
                    } else {
                        setStatusText(t("notFound", { microchip }));
                    }
                } catch (searchError) {
                    console.error("Erro ao pesquisar búfalo após leitura:", searchError);
                    setStatusText(t("searchError"));
                }
                
                setLidas((prev) => {
                    if (!prev.includes(microchip)) {
                        return [...prev, microchip];
                    }
                    return prev;
                });
            }
            await NfcManager.cancelTechnologyRequest();
            if (isScanningRef.current) {
                 lerProximaTag(); 
            }
        } catch (ex) {
            const errorString = (ex as any).toString();
            
            if (errorString.includes('cancelled') || errorString.includes('timeout')) {
                if (isScanningRef.current) {
                    setStatusText(t("timeout"));
                    lerProximaTag(); 
                } else {
                    console.log("Ciclo de leitura finalizado.");
                }
                return;
            }
            setStatusText(t("criticalError"));
            isScanningRef.current = false;
        }
    };

    useEffect(() => {
        const initNFC = async () => {
            isScanningRef.current = true;
            try {
                await NfcManager.start();
                const supported = await NfcManager.isSupported();
                const enabled = await NfcManager.isEnabled();

                if (!supported || !enabled) {
                    setStatusText(t("unavailable"));
                    isScanningRef.current = false;
                    return;
                }
                
                setLidas([]);
                setStatusText(t("waiting"));
                lerProximaTag(); 

            } catch (err) {
                console.error("Erro fatal ao iniciar NFC:", err);
                setStatusText(t("initError"));
                isScanningRef.current = false;
            }
        };

        initNFC();

        return () => {
            isScanningRef.current = false;
            try {
                NfcManager.cancelTechnologyRequest();
            } catch (e) {
            }
        };
    }, []); 

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t("title")}</Text>
                <Text style={styles.status}>{statusText}</Text>
                
                {lidas.length === 0 && isScanningRef.current && (
                    <ActivityIndicator size="large" color={colors.brand.static} style={{ marginVertical: 20 }} />
                )}

                <Button 
                    title={t("finish")} 
                    onPress={finalizarScanner} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.card, justifyContent: 'center', alignItems: 'center', },
    content: { width: '90%', backgroundColor: colors.bg.card, borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: colors.text.accent, },
    status: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: colors.text.muted, },
    tagListContainer: { width: '100%', maxHeight: 250, minHeight: 100, borderWidth: 1, borderColor: colors.border.default, borderRadius: 10, padding: 10, marginTop: 15, marginBottom: 20, },
    listTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: colors.text.accent },
    tagList: { flexGrow: 1, },
    tagText: { fontSize: 14, paddingVertical: 4, color: colors.black },
    emptyText: { textAlign: 'center', marginTop: 20, color: colors.text.muted, },
    button: { backgroundColor: colors.brand.dark, padding: 10, borderRadius: 10 }
});