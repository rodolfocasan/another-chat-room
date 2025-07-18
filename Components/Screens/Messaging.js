// Components/Screens/Messaging.js
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Text, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Animated, Dimensions  } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from 'react-native-vector-icons/Feather';

import MessageComponent from "../Comps/MessageComponent";
import RoomTimer from "../Comps/RoomTimer";
import RoomInfoModal from "../Comps/RoomInfoModal";

import { getSocket } from "../Utils/socket";





const { width } = Dimensions.get('window');

const Messaging = ({ route, navigation }) => {
    const [user, setUser] = useState("");
    const { name, id, isOwner } = route.params;

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    
    // Animaciones para mejorar la experiencia visual
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    // Función para obtener el nombre de usuario del storage
    const getUsername = async () => {
        try {
            const value = await AsyncStorage.getItem("username");
            if (value !== null) {
                setUser(value);
            }
        } catch (e) {
            console.error("Error al cargar el nombre usuario");
        }
    };

    // Función para manejar el envío de nuevos mensajes
    const handleNewMessage = () => {
        if (message.trim() === "" || !socket) return;

        // Formatear la hora actual
        const hour =
            new Date().getHours() < 10
                ? `0${new Date().getHours()}`
                : `${new Date().getHours()}`;

        const mins =
            new Date().getMinutes() < 10
                ? `0${new Date().getMinutes()}`
                : `${new Date().getMinutes()}`;

        if (user) {
            // Emitir el mensaje al servidor
            socket.emit("newMessage", {
                message,
                room_id: id,
                user,
                timestamp: { hour, mins },
            });
            setMessage("");
        }
    };

    // Función para mostrar el modal de información
    const handleInfoPress = () => {
        setInfoModalVisible(true);
    };

    // Configurar el header de navegación
    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
            headerStyle: {
                backgroundColor: '#0d1117',
                borderBottomWidth: 1,
                borderBottomColor: '#21262d',
            },
            headerTitleStyle: {
                color: '#f0f6fc',
                fontSize: 18,
                fontWeight: '600',
            },
            headerTintColor: '#58a6ff',
            headerRight: () => (
                <View style={styles.headerRight}>
                    {roomInfo && (
                        <View style={styles.timerContainer}>
                            <RoomTimer
                                createdAt={roomInfo.createdAt}
                                onExpire={() => navigation.goBack()}
                            />
                        </View>
                    )}
                    {isOwner && (
                        <Pressable onPress={handleInfoPress} style={styles.infoButton}>
                            <Feather name="info" size={20} color="#58a6ff" />
                        </Pressable>
                    )}
                </View>
            )
        });
        getUsername();

        // Inicializar socket y buscar sala
        try {
            const socketInstance = getSocket();
            setSocket(socketInstance);
            socketInstance.emit("findRoom", id);
        } catch (error) {
            console.error('Error obteniendo socket:', error);
        }
    }, [roomInfo, isOwner]);

    // Configurar listeners del socket
    useEffect(() => {
        if (socket) {
            socket.on("foundRoom", (roomChats) => {
                setChatMessages(roomChats);
                // Obtener información de la sala
                socket.emit("getRoomInfo", id);
            });

            socket.on("roomInfo", (info) => {
                setRoomInfo(info);
            });

            socket.on("roomMessage", (newMessage) => {
                setChatMessages(prev => [...prev, newMessage]);
            });

            // Limpiar listeners cuando el componente se desmonte
            return () => {
                socket.off("foundRoom");
                socket.off("roomInfo");
                socket.off("roomMessage");
            };
        }
    }, [socket, id]);

    // Animación de entrada cuando se carga el componente
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Función para renderizar cada mensaje con la información del mensaje anterior
    const renderMessage = ({ item, index }) => {
        const previousMessage = index > 0 ? chatMessages[index - 1] : null;
        return (
            <MessageComponent 
                item={item} 
                user={user} 
                previousMessage={previousMessage}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Contenedor principal de mensajes */}
                <Animated.View 
                    style={[
                        styles.messagesContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {chatMessages.length > 0 ? (
                        <FlatList
                            data={chatMessages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.flatListContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        />
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyStateIconContainer}>
                                <Feather name="message-circle" size={48} color="#30363d" />
                            </View>
                            <Text style={styles.emptyStateTitle}>
                                ¡Sala vacía!
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Aún no hay mensajes. Sé el primero en{'\n'}comenzar la conversación.
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {/* Contenedor de input mejorado */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.messageInput}
                            value={message}
                            onChangeText={(value) => setMessage(value)}
                            placeholder="Escribe un mensaje..."
                            placeholderTextColor="#7d8590"
                            multiline
                            maxLength={500}
                            blurOnSubmit={false}
                            returnKeyType="send"
                            onSubmitEditing={handleNewMessage}
                        />
                        <View style={styles.inputActions}>
                            <Pressable
                                style={[
                                    styles.sendButton,
                                    { 
                                        opacity: message.trim() ? 1 : 0.5,
                                        backgroundColor: message.trim() ? '#238636' : '#30363d'
                                    }
                                ]}
                                onPress={handleNewMessage}
                                disabled={!message.trim()}
                            >
                                <Feather 
                                    name="send" 
                                    size={18} 
                                    color={message.trim() ? "#ffffff" : "#7d8590"} 
                                />
                            </Pressable>
                        </View>
                    </View>
                    
                    {/* Indicador de caracteres restantes */}
                    {message.length > 400 && (
                        <View style={styles.characterCounter}>
                            <Text style={styles.characterCounterText}>
                                {500 - message.length} caracteres restantes
                            </Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Modal de información de la sala */}
            {roomInfo && (
                <RoomInfoModal
                    visible={infoModalVisible}
                    setVisible={setInfoModalVisible}
                    roomInfo={roomInfo}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1117',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#0d1117',
    },
    flatListContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexGrow: 1,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#161b22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#21262d',
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateText: {
        textAlign: 'center',
        color: '#7d8590',
        fontSize: 16,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    inputContainer: {
        backgroundColor: '#161b22',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#21262d',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#21262d',
        borderRadius: 24,
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    messageInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#ffffff',
        maxHeight: 100,
        textAlignVertical: 'top',
        lineHeight: 20,
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 4,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    characterCounter: {
        alignItems: 'flex-end',
        marginTop: 8,
        marginRight: 4,
    },
    characterCounterText: {
        fontSize: 12,
        color: '#7d8590',
        fontStyle: 'italic',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginRight: 4,
    },
    timerContainer: {
        backgroundColor: '#161b22',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#21262d',
    },
    infoButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#21262d',
        borderWidth: 1,
        borderColor: '#30363d',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default Messaging;