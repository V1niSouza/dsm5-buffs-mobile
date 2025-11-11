// NfcScannerScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button'; // Componente de botão
import { colors } from '../styles/colors'; // Cores do projeto

type RootStackParamList = {
  RebanhoScreen: { lidas?: string[] };
  NfcScannerScreen: undefined;
};

export const NfcScannerScreen = () => {
    // 🔑 Navegação para retornar à tela RebanhoScreen
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const [lidas, setLidas] = useState<string[]>([]);
    const [statusText, setStatusText] = useState("Iniciando o scanner...");
    
    // Referência síncrona para controlar o ciclo de leitura
    const isScanningRef = useRef(false);

    // FUNÇÃO DE PARADA E RETORNO DE DADOS
    const finalizarScanner = () => {
        isScanningRef.current = false;
        
        try {
            // Cancela a requisição pendente para liberar o leitor
            NfcManager.cancelTechnologyRequest();
        } catch (e) {
            console.log("Erro ao limpar requisição NFC:", e);
        }
        
        // Retorna à tela anterior (RebanhoScreen) passando a lista de tags
        navigation.navigate('RebanhoScreen', { lidas: lidas }); 
    };

    // FUNÇÃO RECURSIVA DE LEITURA (A lógica NFC que funciona)
    const lerProximaTag = async () => {
        if (!isScanningRef.current) return; 

        try {
            setStatusText("Aproxime o brinco do leitor...");
            
            // 1. Requisita a tecnologia (Bloqueia o app)
            await NfcManager.requestTechnology(NfcTech.NfcA);
            const tag = await NfcManager.getTag();
            
            if (tag?.id) {
                const tagId = tag.id.toUpperCase();
                console.log(`✅ TAG CAPTURADA: ${tagId}`);
                
                // Atualiza o estado lidas, o que GARANTE A RE-RENDERIZAÇÃO COMPLETA da tela
                setLidas((prev) => {
                    if (!prev.includes(tagId)) {
                        return [...prev, tagId];
                    }
                    return prev;
                });
            }
            
            // 2. Libera o leitor
            await NfcManager.cancelTechnologyRequest();
            
            // 3. Reinicia o ciclo (Recursão)
            if (isScanningRef.current) {
                 lerProximaTag(); 
            }

        } catch (ex) {
            const errorString = (ex as any).toString();
            
            if (errorString.includes('cancelled') || errorString.includes('timeout')) {
                if (isScanningRef.current) {
                    setStatusText("Tempo esgotado ou cancelado. Tentando novamente...");
                    lerProximaTag(); 
                } else {
                    console.log("Ciclo de leitura finalizado.");
                }
                return;
            }

            console.error("❌ Erro fatal na leitura de tag:", ex);
            setStatusText("Erro crítico no NFC. Parando.");
            isScanningRef.current = false;
        }
    };

    // EFEITO DE MONTAGEM E DESMONTAGEM (Substitui iniciar/pararScanner)
    useEffect(() => {
        const initNFC = async () => {
            isScanningRef.current = true;
            try {
                await NfcManager.start();
                const supported = await NfcManager.isSupported();
                const enabled = await NfcManager.isEnabled();

                if (!supported || !enabled) {
                    setStatusText("NFC não disponível ou desativado neste dispositivo.");
                    isScanningRef.current = false;
                    return;
                }
                
                setLidas([]);
                setStatusText("Aguardando aproximação...");
                lerProximaTag(); 

            } catch (err) {
                console.error("Erro fatal ao iniciar NFC:", err);
                setStatusText("Erro de inicialização. Verifique as permissões.");
                isScanningRef.current = false;
            }
        };

        initNFC();

        // 🚨 Função de limpeza: Garante que o NFC seja liberado ao fechar a tela
        return () => {
            isScanningRef.current = false;
            try {
                NfcManager.cancelTechnologyRequest();
            } catch (e) {
                // Limpeza silenciosa
            }
        };
    }, []); 

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Escaneamento NFC</Text>
                <Text style={styles.status}>{statusText}</Text>
                
                {lidas.length === 0 && isScanningRef.current && (
                    <ActivityIndicator size="large" color={colors.yellow.static} style={{ marginVertical: 20 }} />
                )}

                <View style={styles.tagListContainer}>
                    <Text style={styles.listTitle}>Microchips Lidos ({lidas.length}):</Text>
                    {/* A lista agora renderiza perfeitamente, pois o componente é uma tela primária */}
                    <ScrollView style={styles.tagList} contentContainerStyle={{ paddingBottom: 10 }}>
                        {lidas.length === 0 && isScanningRef.current ? (
                            <Text style={styles.emptyText}>Aproxime a primeira tag...</Text>
                        ) : (
                            lidas.map((id, index) => (
                                <Text key={id || index} style={styles.tagText}>{id}</Text>
                            ))
                        )}
                    </ScrollView>
                </View>

                <Button 
                    title="Finalizar e Voltar" 
                    onPress={finalizarScanner} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white.base, justifyContent: 'center', alignItems: 'center', },
    content: { width: '90%', backgroundColor: colors.white.base, borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: colors.brown.base, },
    status: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: colors.gray.base, },
    tagListContainer: { width: '100%', maxHeight: 250, minHeight: 100, borderWidth: 1, borderColor: colors.gray.disabled, borderRadius: 10, padding: 10, marginTop: 15, marginBottom: 20, },
    listTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: colors.brown.base },
    tagList: { flexGrow: 1, },
    tagText: { fontSize: 14, paddingVertical: 4, color: colors.black.base },
    emptyText: { textAlign: 'center', marginTop: 20, color: colors.gray.base, },
    button: { backgroundColor: colors.yellow.dark, padding: 10, borderRadius: 10 }
});