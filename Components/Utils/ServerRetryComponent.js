// Components/Utils/ServerRetryComponent.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";





const ServerRetryComponent = ({ onRetry }) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        await onRetry();
        setIsRetrying(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <View style={styles.connectionIcon}>
                        <View style={styles.connectionDot} />
                        <View style={styles.connectionLine} />
                        <View style={styles.connectionDotDisabled} />
                    </View>
                </View>

                <Text style={styles.title}>Conexión no disponible</Text>
                <Text style={styles.message}>
                    Se intentó conectar al servidor pero no hubo respuesta.
                </Text>
                <Text style={styles.subMessage}>
                    Presiona el botón de abajo para volver a intentar.
                </Text>

                <TouchableOpacity
                    style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
                    onPress={handleRetry}
                    disabled={isRetrying}
                    activeOpacity={0.8}
                >
                    {isRetrying ? (
                        <View style={styles.retryContent}>
                            <ActivityIndicator size="small" color="#ffffff" />
                            <Text style={styles.retryButtonText}>Conectando...</Text>
                        </View>
                    ) : (
                        <Text style={styles.retryButtonText}>Volver a intentar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0e1a',
        padding: 20,
    },
    contentContainer: {
        alignItems: 'center',
        maxWidth: 320,
        width: '100%',
    },
    iconContainer: {
        marginBottom: 32,
    },
    connectionIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3b82f6',
    },
    connectionLine: {
        width: 40,
        height: 2,
        backgroundColor: '#374151',
        marginHorizontal: 8,
    },
    connectionDotDisabled: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#6b7280',
        opacity: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 16,
        color: '#cbd5e1',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 24,
        fontWeight: '400',
    },
    subMessage: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
        fontWeight: '400',
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    retryButtonDisabled: {
        backgroundColor: '#4b5563',
        shadowOpacity: 0.1,
    },
    retryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default ServerRetryComponent;