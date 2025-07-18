// Components/Comps/RoomTimer.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

//import { styles } from '../Utils/styles';





const RoomTimer = ({ createdAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const created = new Date(createdAt).getTime();
            const expiryTime = created + (30 * 60 * 1000); // 30 minutos en milisegundos
            const remaining = expiryTime - now;

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeLeft(0);
                if (onExpire) onExpire();
                return 0;
            }

            return remaining;
        };

        // Calcular tiempo inicial
        const initialTime = calculateTimeLeft();
        setTimeLeft(initialTime);

        // Actualizar cada segundo
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt, onExpire]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        const totalTime = 30 * 60 * 1000; // 30 minutos
        const percentage = (timeLeft / totalTime) * 100;

        if (percentage > 50) return '#4CAF50'; // Verde
        if (percentage > 25) return '#FF9800'; // Naranja
        return '#F44336'; // Rojo
    };

    if (isExpired) {
        return (
            <View style={styles.timerContainer}>
                <Text style={[styles.timerText, { color: '#F44336' }]}>
                    EXPIRADA
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
                {formatTime(timeLeft)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        backgroundColor: '#21262d',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    timerText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
});

export default RoomTimer;