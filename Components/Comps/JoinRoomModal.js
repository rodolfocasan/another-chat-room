// Components/Comps/JoinRoomModal.js
import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PinInput from "./PinInput";

import { getSocket } from "../Utils/socket";
//import { styles } from "../Utils/styles";





const JoinRoomModal = ({ visible, setVisible }) => {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinRoom = async () => {
        if (pin.length !== 12) {
            Alert.alert("Error", "El PIN debe tener 12 caracteres");
            return;
        }

        setLoading(true);
        try {
            const username = await AsyncStorage.getItem("username");
            const socket = getSocket();

            socket.emit("joinRoom", { pin, username });

            socket.once("joinRoomResponse", (response) => {
                setLoading(false);
                if (response.success) {
                    Alert.alert("Éxito", "Te has unido a la sala correctamente");
                    setVisible(false);
                    setPin("");
                } else {
                    Alert.alert("Error", response.message || "No se pudo unir a la sala");
                }
            });

        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Hubo un problema al unirse a la sala");
        }
    };

    const handleClose = () => {
        setVisible(false);
        setPin("");
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Unirse a Sala</Text>
                    <Text style={styles.modalSubtitle}>
                        Ingresa el PIN de la sala (12 caracteres):
                    </Text>

                    <View style={{ marginVertical: 20 }}>
                        <PinInput onPinChange={setPin} />
                    </View>

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.joinButton]}
                            onPress={handleJoinRoom}
                            disabled={loading || pin.length !== 12}
                        >
                            <Text style={styles.joinButtonText}>
                                {loading ? "Uniéndose..." : "Unirse"}
                            </Text>
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
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f0f6fc',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#8b949e',
        textAlign: 'center',
        marginBottom: 20,
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
    },
    cancelButton: {
        backgroundColor: '#21262d',
        borderWidth: 1,
        borderColor: '#30363d',
    },
    cancelButtonText: {
        color: '#f0f6fc',
        fontSize: 16,
        fontWeight: '500',
    },
    joinButton: {
        backgroundColor: '#238636',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default JoinRoomModal;