// Components/Utils/ipDetection.js
import NetInfo from '@react-native-community/netinfo';





export const getServerIP = async () => {
    const PORT = 4000;

    try {
        console.log('🔍 Getting network information...');
        const networkState = await NetInfo.fetch();

        console.log('Network state:', networkState);

        if (!networkState.isConnected) {
            throw new Error('No network connection available');
        }

        if (networkState.type !== 'wifi') {
            throw new Error('Device is not connected to WiFi. Please connect to the same WiFi network as the server.');
        }

        // Obtener la IP del gateway desde los detalles de la conexión
        let gatewayIP = null;
        let deviceIP = null;

        if (networkState.details && networkState.details.ipAddress) {
            deviceIP = networkState.details.ipAddress;
            console.log('📱 Device IP:', deviceIP);

            // Calcular la IP del gateway basándose en la IP del dispositivo
            const ipParts = deviceIP.split('.');
            if (ipParts.length === 4) {
                gatewayIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1`;
                console.log('🌐 Gateway IP (estimated):', gatewayIP);
            }
        }

        // Lista de IPs candidatas para buscar el servidor
        const candidateIPs = [];

        // Si tenemos la IP del dispositivo, buscar en la misma subred
        if (deviceIP) {
            const ipParts = deviceIP.split('.');
            if (ipParts.length === 4) {
                const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.`;

                // Agregar IPs comunes para servidores
                candidateIPs.push(
                    baseIP + '1',     // Gateway
                    baseIP + '100',   // IP común para servidores
                    baseIP + '101',
                    baseIP + '102',
                    baseIP + '200',
                    baseIP + '254'    // Última IP del rango
                );

                // Agregar la IP del dispositivo (por si el servidor está en el mismo dispositivo)
                candidateIPs.push(deviceIP);
            }
        }

        // Agregar IPs comunes como fallback
        candidateIPs.push(
            '192.168.1.1',
            '192.168.1.100',
            '192.168.0.1',
            '192.168.0.100',
            '10.0.0.1',
            '10.0.0.100',
            '172.16.0.1',
            '172.16.0.100',
            'localhost'
        );

        console.log('🎯 Testing candidate IPs:', candidateIPs);

        // Probar cada IP candidata
        for (const ip of candidateIPs) {
            console.log(`Testing IP: ${ip}`);
            const result = await testIP(ip, PORT);
            if (result) {
                console.log(`✅ Server found at: ${ip}`);
                return ip;
            }
        }

        // Si no encuentra nada con las IPs candidatas, hacer un escaneo más amplio
        // pero solo en la subred del dispositivo
        if (deviceIP) {
            console.log('🔍 Performing broader scan on device subnet...');
            const ipParts = deviceIP.split('.');
            if (ipParts.length === 4) {
                const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.`;
                const foundIP = await scanIPRange(baseIP, PORT);
                if (foundIP) {
                    return foundIP;
                }
            }
        }

        throw new Error('Server not found on local network');

    } catch (error) {
        console.error('Error in getServerIP:', error);
        throw error;
    }
};

// Función para probar una IP específica
const testIP = async (ip, port) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

        const response = await fetch(`http://${ip}:${port}/api`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            // Verificar que la respuesta sea del servidor correcto
            const data = await response.json();
            if (Array.isArray(data)) { // El servidor devuelve un array de rooms
                return ip;
            }
        }
    } catch (error) {
        // IP no disponible o timeout
        return null;
    }
    return null;
};

// Función para escanear un rango de IPs (versión optimizada)
const scanIPRange = async (baseIP, port) => {
    const promises = [];

    // Crear promesas para IPs del 1 al 254
    for (let i = 1; i <= 254; i++) {
        const ip = baseIP + i;
        promises.push(testIP(ip, port));
    }

    // Usar Promise.allSettled para esperar todas las promesas
    const results = await Promise.allSettled(promises);

    // Buscar el primer resultado exitoso
    for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
            return result.value;
        }
    }

    return null;
};

// Función auxiliar para obtener información de red (opcional, para debugging)
export const getNetworkInfo = async () => {
    try {
        const networkState = await NetInfo.fetch();
        return {
            isConnected: networkState.isConnected,
            type: networkState.type,
            details: networkState.details
        };
    } catch (error) {
        console.error('Error getting network info:', error);
        return null;
    }
};