// Components/Comps/RoomInfoModal.js
import React from "react";
import { View, Text, Pressable, Modal, Alert, Share, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

//import { styles } from "../Utils/styles";





const RoomInfoModal = ({ visible, setVisible, roomInfo }) => {
    const formatPin = (pin) => {
        if (!pin || pin.length !== 12) return pin;
        return `${pin.slice(0, 3)} ${pin.slice(3, 6)} ${pin.slice(6, 9)} ${pin.slice(9, 12)}`;
    };

    const handleCopyPin = async () => {
        try {
            // Usar Clipboard de Expo
            const Clipboard = require('expo-clipboard');
            await Clipboard.setStringAsync(roomInfo.pin);
            Alert.alert("Copiado", "PIN copiado al portapapeles");
        } catch (error) {
            // Fallback para otras versiones
            try {
                const { Clipboard } = require('react-native');
                Clipboard.setString(roomInfo.pin);
                Alert.alert("Copiado", "PIN copiado al portapapeles");
            } catch (fallbackError) {
                Alert.alert("Error", "No se pudo copiar el PIN");
            }
        }
    };

    const handleSharePin = async () => {
        try {
            await Share.share({
                message: `¡Únete a mi sala de chat!\n\nNombre: ${roomInfo.name}\nPIN: ${formatPin(roomInfo.pin)}\n\nUsa este PIN para unirte a la conversación.`,
                title: "Invitación a sala de chat"
            });
        } catch (error) {
            Alert.alert("Error", "No se pudo compartir el PIN");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Información de la Sala</Text>
                        <Pressable onPress={() => setVisible(false)}>
                            <Feather name="x" size={24} color="#666" />
                        </Pressable>
                    </View>

                    <View style={styles.roomInfoContainer}>
                        <Text style={styles.roomInfoLabel}>Nombre:</Text>
                        <Text style={styles.roomInfoValue}>{roomInfo?.name}</Text>

                        <Text style={styles.roomInfoLabel}>PIN de la Sala:</Text>
                        <View style={styles.pinContainer}>
                            <Text style={styles.pinText}>{formatPin(roomInfo?.pin)}</Text>
                        </View>

                        <Text style={styles.roomInfoDescription}>
                            Comparte este PIN con otros usuarios para que puedan unirse a tu sala.
                        </Text>
                    </View>

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.copyButton]}
                            onPress={handleCopyPin}
                        >
                            <Feather name="copy" size={16} color="#fff" />
                            <Text style={styles.copyButtonText}>Copiar PIN</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.shareButton]}
                            onPress={handleSharePin}
                        >
                            <Feather name="share-2" size={16} color="#fff" />
                            <Text style={styles.shareButtonText}>Compartir</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: '#161b22',
        padding: 24,
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f0f6fc',
    },
    roomInfoContainer: {
        marginBottom: 24,
    },
    roomInfoLabel: {
        fontSize: 14,
        color: '#8b949e',
        marginBottom: 6,
        fontWeight: '500',
    },
    roomInfoValue: {
        fontSize: 16,
        color: '#f0f6fc',
        marginBottom: 16,
        fontWeight: '600',
    },
    pinContainer: {
        backgroundColor: '#21262d',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#30363d',
        marginBottom: 16,
    },
    pinText: {
        fontSize: 18,
        color: '#58a6ff',
        fontFamily: 'monospace',
        fontWeight: '600',
        textAlign: 'center',
    },
    roomInfoDescription: {
        fontSize: 14,
        color: '#8b949e',
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    copyButton: {
        backgroundColor: '#1f6feb',
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    shareButton: {
        backgroundColor: '#238636',
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default RoomInfoModal;