// Components/Comps/Modal.js
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Modal as RNModal, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getSocket } from "../Utils/socket";





const Modal = ({ setVisible }) => {
    const closeModal = () => setVisible(false);
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        if (groupName.trim() === "") {
            Alert.alert("Error", "Por favor ingresa un nombre para la sala");
            return;
        }

        setLoading(true);
        try {
            const username = await AsyncStorage.getItem("username");
            const socket = getSocket();

            socket.emit("createRoom", { name: groupName, creator: username });

            socket.once("roomCreated", (response) => {
                setLoading(false);
                if (response.success) {
                    Alert.alert("Éxito", "Sala creada correctamente");
                    setVisible(false);
                    setGroupName("");
                } else {
                    Alert.alert("Error", "No se pudo crear la sala");
                }
            });
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Hubo un problema al crear la sala");
        }
    };

    return (
        <RNModal visible={true} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Crear Nueva Sala</Text>
                    <Text style={styles.modalSubtitle}>
                        Introduce el nombre de la sala:
                    </Text>

                    <TextInput
                        style={styles.modalInput}
                        placeholder="Nombre de la sala"
                        placeholderTextColor="#8b949e"
                        value={groupName}
                        onChangeText={setGroupName}
                        autoFocus
                        maxLength={30}
                    />

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={closeModal}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.createButton]}
                            onPress={handleCreateRoom}
                            disabled={loading || !groupName.trim()}
                        >
                            <Text style={styles.createButtonText}>
                                {loading ? "Creando..." : "Crear"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
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
    modalInput: {
        backgroundColor: '#21262d',
        borderWidth: 1,
        borderColor: '#30363d',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#f0f6fc',
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
    createButton: {
        backgroundColor: '#238636',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Modal;