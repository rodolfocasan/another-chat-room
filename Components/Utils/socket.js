// Components/Utils/socket.js
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";





// URL por defecto
const DEFAULT_SERVER_URL = "https://another-chat-room.onrender.com/";

let socket = null;
let currentServerUrl = DEFAULT_SERVER_URL;

const getServerUrl = async () => {
    try {
        const savedUrl = await AsyncStorage.getItem("serverUrl");
        return savedUrl || DEFAULT_SERVER_URL;
    } catch (error) {
        console.error("Error obteniendo URL del servidor:", error);
        return DEFAULT_SERVER_URL;
    }
};

export const initializeSocket = async () => {
    try {
        console.log('Conectando con servidor...');

        // Obtener URL del servidor
        currentServerUrl = await getServerUrl();
        console.log('URL del servidor:', currentServerUrl);

        // Desconectar socket anterior si existe
        if (socket) {
            socket.disconnect();
            socket = null;
        }

        // Crear nueva conexión
        socket = io.connect(currentServerUrl, {
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 15000,
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        return new Promise((resolve, reject) => {
            let resolved = false;

            const connectionTimeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    reject(new Error('[!!] Connection timeout'));
                }
            }, 15000);

            socket.on('connect', () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(connectionTimeout);
                    console.log('[OK] Conectado a servidor');
                    resolve(socket);
                }
            });

            socket.on('disconnect', () => {
                console.log('[!!] Desconectado de servidor');
            });

            socket.on('connect_error', (error) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(connectionTimeout);
                    console.log('[!!] Connection error:', error.message);
                    reject(error);
                }
            });

            socket.on('error', (error) => {
                console.log('[!!] Socket error:', error);
            });
        });

    } catch (error) {
        console.error('[!!] No se pudo inicializar el socket:', error);
        throw error;
    }
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('[!!] El socket no se ha inicializado. Primero llame a initializeSocket().');
    }
    return socket;
};

export const getServerAddress = async () => {
    return await getServerUrl();
};

export const reconnectSocket = async () => {
    console.log('[??] Intentando reconexión...');
    return await initializeSocket();
};

// Función para cambiar el servidor
export const changeServer = async (newUrl) => {
    try {
        await AsyncStorage.setItem("serverUrl", newUrl);
        currentServerUrl = newUrl;

        // Reconectar con la nueva URL
        return await initializeSocket();
    } catch (error) {
        console.error("Error cambiando servidor:", error);
        throw error;
    }
};

export default { initializeSocket, getSocket, getServerAddress, reconnectSocket, changeServer };