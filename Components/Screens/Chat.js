// Components/Screens/Chat.js
import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

import Modal from "../Comps/Modal";
import JoinRoomModal from "../Comps/JoinRoomModal";
import SettingsModal from "../Comps/SettingsModal";
import ChatComponent from "../Comps/ChatComponent";

import { getSocket, getServerAddress, changeServer } from "../Utils/socket";
//import { styles } from "../Utils/styles";





const Chat = () => {
    const [visible, setVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [myRooms, setMyRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [socket, setSocket] = useState(null);

    const handleRoomExpire = (roomId) => {
        if (socket) {
            socket.emit("expireRoom", roomId);
        }
    };

    const handleServerChange = async (newUrl) => {
        try {
            console.log("Cambiando servidor a:", newUrl);
            const newSocket = await changeServer(newUrl);
            setSocket(newSocket);

            // Recargar datos con el nuevo servidor
            const username = await AsyncStorage.getItem("username");
            if (username) {
                newSocket.emit("getUserRooms", username);
            }
        } catch (error) {
            console.error("Error cambiando servidor:", error);
        }
    };

    useLayoutEffect(() => {
        const initializeConnection = async () => {
            try {
                const socketInstance = getSocket();
                setSocket(socketInstance);

                // Obtener el username para filtrar las salas
                const username = await AsyncStorage.getItem("username");

                // Solicitar las salas del usuario
                socketInstance.emit("getUserRooms", username);

                const serverAddress = await getServerAddress();
                if (serverAddress) {
                    // Hacer fetch a la API del servidor
                    fetch(`${serverAddress}api`)
                        .then((res) => {
                            if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`);
                            }
                            const contentType = res.headers.get('content-type');
                            if (!contentType || !contentType.includes('application/json')) {
                                throw new Error('Response is not JSON');
                            }
                            return res.json();
                        })
                        .then((data) => {
                            console.log('Datos del servidor:', data);
                            // Actualizar listas cuando hay cambios
                            socketInstance.emit("getUserRooms", username);
                        })
                        .catch((err) => {
                            console.error('Error fetching rooms:', err);
                            // Continuar sin hacer fetch, el socket manejará la sincronización
                        });
                }
            } catch (error) {
                console.error('Error initializing connection:', error);
            }
        };

        initializeConnection();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("userRooms", (data) => {
                setMyRooms(data.myRooms);
                setJoinedRooms(data.joinedRooms);
            });

            socket.on("roomsList", (rooms) => {
                // Actualizar listas cuando hay cambios
                AsyncStorage.getItem("username").then(username => {
                    if (username) {
                        socket.emit("getUserRooms", username);
                    }
                });
            });

            socket.on("roomExpired", (roomId) => {
                // Actualizar listas cuando una sala expira
                AsyncStorage.getItem("username").then(username => {
                    if (username) {
                        socket.emit("getUserRooms", username);
                    }
                });
            });

            return () => {
                socket.off("userRooms");
                socket.off("roomsList");
                socket.off("roomExpired");
            };
        }
    }, [socket]);

    const handleCreateGroup = () => setVisible(true);
    const handleJoinRoom = () => setJoinModalVisible(true);
    const handleSettings = () => setSettingsModalVisible(true);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.chatscreen}>
                <View style={styles.chattopContainer}>
                    <View style={styles.chatheader}>
                        <Text style={styles.chatheading}>A.C.R</Text>
                        <Pressable onPress={handleSettings} style={styles.settingsButton}>
                            <Feather name='settings' size={24} color='#666' />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.chatlistContainer}>
                    {/* Sección Mis Rooms */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Mis Rooms</Text>
                            <Pressable onPress={handleCreateGroup} style={styles.addButton}>
                                <Feather name='plus' size={20} color='green' />
                                <Text style={styles.addButtonText}>Crear Room</Text>
                            </Pressable>
                        </View>

                        {myRooms.length > 0 ? (
                            <FlatList
                                data={myRooms}
                                renderItem={({ item }) => (
                                    <ChatComponent
                                        item={item}
                                        isOwner={true}
                                        onRoomExpire={handleRoomExpire}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No has creado ninguna room aún</Text>
                        )}
                    </View>

                    {/* Sección Otros Rooms */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Otros Rooms</Text>
                            <Pressable onPress={handleJoinRoom} style={styles.addButton}>
                                <Feather name='plus' size={20} color='blue' />
                                <Text style={styles.addButtonText}>Unirse a Room</Text>
                            </Pressable>
                        </View>

                        {joinedRooms.length > 0 ? (
                            <FlatList
                                data={joinedRooms}
                                renderItem={({ item }) => (
                                    <ChatComponent
                                        item={item}
                                        isOwner={false}
                                        onRoomExpire={handleRoomExpire}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No te has unido a ninguna room</Text>
                        )}
                    </View>
                </View>

                {visible && <Modal setVisible={setVisible} />}
                {joinModalVisible && <JoinRoomModal visible={joinModalVisible} setVisible={setJoinModalVisible} />}
                {settingsModalVisible && (
                    <SettingsModal
                        visible={settingsModalVisible}
                        setVisible={setSettingsModalVisible}
                        onServerChange={handleServerChange}
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    chatscreen: {
        flex: 1,
        backgroundColor: '#0d1117',
    },
    chattopContainer: {
        backgroundColor: '#161b22',
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#21262d',
    },
    chatheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    chatheading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f0f6fc',
    },
    settingsButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#21262d',
    },
    chatlistContainer: {
        flex: 1,
        backgroundColor: '#0d1117',
        paddingTop: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f0f6fc',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#21262d',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    addButtonText: {
        color: '#f0f6fc',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    emptyText: {
        color: '#8b949e',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
        paddingHorizontal: 20,
    },
});

export default Chat;