import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { colors } from "../../styles/colors";
import { ConfirmarAlteracaoStatusModal } from "../ModalAlterarStatus";
import bufaloService from "../../services/bufaloService";
import Pen  from "../../../assets/images/pen.svg";

export const AnimalInfoCard = ({ detalhes, onEdit }: { detalhes: any, onEdit: () => void }) => {

  // Função auxiliar para formatar
  function formatarDataSimples(dataISO: string) {
    if (!dataISO) {
      return '-';
    }
    const soData = dataISO.split('T')[0];
    const partes = soData.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  
  const maturidadeMap: Record<string, string> = {
    B: "Bezerro",
    N: "Novilha",
    T: "Touro",
    V: "Vaca",
  };

  const maturidadeTexto = maturidadeMap[detalhes.nivel_maturidade] || detalhes.nivel_maturidade;
  const[isEnabled, setIsEnabled] = useState(Boolean(detalhes?.status));
  const [modalVisible, setModalVisible] = useState(false);
  const [novoStatus, setNovoStatus] = useState<boolean | null>(null);
  
  const toggleSwitch = () => {
    const valorPretendido = !isEnabled;
    setNovoStatus(valorPretendido);
    setModalVisible(true);
  };
  
  const confirmarAlteracaoStatus = async () => {
    if (novoStatus === null) return;
    try {
      await bufaloService.updateBufalo(detalhes.id_bufalo, { status: novoStatus });
      setIsEnabled(novoStatus);
      detalhes.status = novoStatus;
    } catch (error) {
      console.log("Erro ao alterar status:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const cancelarAlteracao = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.infoCard}>
        {/* Header com nome, categoria e status */}
        <View style={styles.infoHeader}>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{detalhes?.nome ?? 'Sem Nome'}</Text>
              {detalhes?.categoria && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{detalhes.categoria}</Text>
                </View>
              )}
            </View>
            <Text style={styles.brincoText}>Brinco Nº: {detalhes?.brinco ?? '-'}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Pen width={20} height={20} fill={colors.brown.base} />
            </TouchableOpacity>
            <View style={[
              styles.statusBadge,
              { backgroundColor: detalhes?.status ? colors.green.active : colors.red.inactive },
                ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: detalhes?.status ? colors.green.extra : colors.red.extra },
                ]} />
              <Text style={[
                styles.statusText,
                { color: detalhes?.status ? colors.green.text : colors.red.text },
                   ]}>
                {detalhes?.status ? 'Ativo' : 'Inativo'}
              </Text>
              <Switch
                trackColor={{ false: colors.gray.claro, true: colors.gray.claro }}
                thumbColor={isEnabled ? colors.green.extra : colors.red.extra}
                onValueChange={toggleSwitch}
                value={isEnabled} />
            </View>
          </View>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.Row}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nascimento</Text>
              <Text style={styles.infoValue}>{detalhes?.dt_nascimento ? detalhes.dt_nascimento.split('T')[0].split('-').reverse().join('/') : '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Maturidade</Text>
              <Text style={styles.infoValue}>{maturidadeTexto ?? '-'}</Text>
            </View>
          </View>
          <View style={styles.Row}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{detalhes?.sexo === 'F' ? 'Fêmea' : 'Macho'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Origem</Text>
              <Text style={styles.infoValue}>{detalhes?.origem ?? '-'}</Text>
            </View>
          </View>
          <View style={styles.Row}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Raça</Text>
              <Text style={styles.infoValue}>{detalhes?.racaNome ?? '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Grupo</Text>
              <Text style={styles.infoValue}>{detalhes?.grupo ?? '-'}</Text>
            </View>
          </View>
          <View style={styles.Row}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pai</Text>
              <Text style={styles.infoValue}>{detalhes?.paiNome ?? '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mãe</Text>
              <Text style={styles.infoValue}>{detalhes?.maeNome ?? '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      <ConfirmarAlteracaoStatusModal
        visible={modalVisible}
        novoStatus={novoStatus ?? false}
        onClose={cancelarAlteracao}
        onConfirm={confirmarAlteracaoStatus}
      />
    </>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  infoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  nameText: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1A1A1A' 
  },
  brincoText: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 2 
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#92400E' 
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 4 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  infoGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 12, 
    gap: 12 
  },
  Row: { 
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: { 
    width: '50%', 
    marginBottom: 8 
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#6B7280' 
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#1A1A1A', 
    marginTop: 2 
  },
  editButton: {
        padding: 5,
    },
});
