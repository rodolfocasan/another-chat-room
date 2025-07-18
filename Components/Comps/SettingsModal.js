// Components/Comps/SettingsModal.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, Alert, StyleSheet, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";





const SettingsModal = ({ visible, setVisible, onServerChange }) => {
    const [serverUrl, setServerUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadServerUrl = async () => {
            try {
                const savedUrl = await AsyncStorage.getItem("serverUrl");
                if (savedUrl) {
                    setServerUrl(savedUrl);
                } else {
                    // URL por defecto
                    setServerUrl("https://another-chat-room.onrender.com/");
                }
            } catch (error) {
                console.error("Error cargando URL del servidor:", error);
                setServerUrl("https://another-chat-room.onrender.com/");
            }
        };

        if (visible) {
            loadServerUrl();
        }
    }, [visible]);

    const handleSaveSettings = async () => {
        if (!serverUrl.trim()) {
            Alert.alert("Error", "La URL del servidor no puede estar vacía");
            return;
        }

        // Validar formato básico de URL
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(serverUrl.trim())) {
            Alert.alert("Error", "Por favor ingresa una URL válida (debe comenzar con http:// o https://)");
            return;
        }

        setLoading(true);
        try {
            let formattedUrl = serverUrl.trim();
            if (!formattedUrl.endsWith('/')) {
                formattedUrl += '/';
            }

            await AsyncStorage.setItem("serverUrl", formattedUrl);

            if (onServerChange) {
                onServerChange(formattedUrl);
            }

            Alert.alert("Éxito", "Configuración guardada correctamente");
            setVisible(false);
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la configuración");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
        // Resetear al valor original
        AsyncStorage.getItem("serverUrl").then(savedUrl => {
            if (savedUrl) {
                setServerUrl(savedUrl);
            } else {
                setServerUrl("https://another-chat-room.onrender.com/");
            }
        });
    };

    const handleOpenGitHub = () => {
        Linking.openURL("https://github.com/rodolfocasan/another-chat-room");
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Configuración</Text>
                        <Pressable onPress={handleCancel}>
                            <Feather name="x" size={24} color="#666" />
                        </Pressable>
                    </View>

                    <View style={styles.settingsContainer}>
                        <Text style={styles.settingsLabel}>URL del Servidor:</Text>
                        <TextInput
                            style={styles.settingsInput}
                            value={serverUrl}
                            onChangeText={setServerUrl}
                            placeholder="https://tu-servidor.com/"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                        <Text style={styles.settingsHelp}>
                            Ingresa la URL completa del servidor de chat
                        </Text>
                    </View>

                    {/* Sección Acerca de la App */}
                    <View style={styles.aboutContainer}>
                        <Text style={styles.aboutTitle}>Acerca de la App</Text>
                        <Text style={styles.aboutText}>
                            Desarrollado por <Text style={styles.authorName}>Rodolfo Casan</Text>
                        </Text>
                        <Pressable onPress={handleOpenGitHub} style={styles.githubLink}>
                            <Feather name="github" size={16} color="#58a6ff" />
                            <Text style={styles.githubText}>Código abierto en GitHub</Text>
                        </Pressable>
                    </View>

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={handleSaveSettings}
                            disabled={loading}
                        >
                            <Text style={styles.saveButtonText}>
                                {loading ? "Guardando..." : "Guardar cambios"}
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
    settingsContainer: {
        marginBottom: 24,
    },
    settingsLabel: {
        fontSize: 14,
        color: '#8b949e',
        marginBottom: 8,
        fontWeight: '500',
    },
    settingsInput: {
        backgroundColor: '#21262d',
        borderWidth: 1,
        borderColor: '#30363d',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#f0f6fc',
        marginBottom: 8,
    },
    settingsHelp: {
        fontSize: 12,
        color: '#6e7681',
        lineHeight: 16,
    },
    aboutContainer: {
        marginBottom: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#30363d',
    },
    aboutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f0f6fc',
        marginBottom: 12,
    },
    aboutText: {
        fontSize: 14,
        color: '#8b949e',
        marginBottom: 10,
        lineHeight: 20,
    },
    authorName: {
        color: '#f0f6fc',
        fontWeight: '600',
    },
    githubLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#21262d',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    githubText: {
        color: '#58a6ff',
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
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
    saveButton: {
        backgroundColor: '#238636',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SettingsModal;