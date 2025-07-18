// Components/Comps/PinInput.js
import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

//import { styles } from '../Utils/styles';





const PinInput = ({ onPinChange, pinLength = 12 }) => {
    const [pins, setPins] = useState(Array(pinLength).fill(''));
    const inputRefs = useRef([]);

    const handlePinChange = (index, value) => {
        // Solo permitir letras y números
        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        if (sanitizedValue.length <= 1) {
            const newPins = [...pins];
            newPins[index] = sanitizedValue;
            setPins(newPins);

            // Llamar callback con el pin completo
            onPinChange(newPins.join(''));

            // Mover al siguiente input si hay valor
            if (sanitizedValue && index < pinLength - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && !pins[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {Array.from({ length: 2 }).map((_, groupIndex) => (
                    <View key={groupIndex} style={styles.groupContainer}>
                        <View style={styles.groupLabel}>
                            <Text style={styles.labelText}>{groupIndex + 1}</Text>
                        </View>
                        <View style={styles.group}>
                            {Array.from({ length: 3 }).map((_, inputIndex) => {
                                const index = groupIndex * 3 + inputIndex;
                                return (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => inputRefs.current[index] = ref}
                                        style={styles.input}
                                        value={pins[index]}
                                        onChangeText={(value) => handlePinChange(index, value)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                        maxLength={1}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        textAlign="center"
                                        selectTextOnFocus
                                    />
                                );
                            })}
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.row}>
                {Array.from({ length: 2 }).map((_, groupIndex) => (
                    <View key={groupIndex + 2} style={styles.groupContainer}>
                        <View style={styles.groupLabel}>
                            <Text style={styles.labelText}>{groupIndex + 3}</Text>
                        </View>
                        <View style={styles.group}>
                            {Array.from({ length: 3 }).map((_, inputIndex) => {
                                const index = (groupIndex + 2) * 3 + inputIndex;
                                return (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => inputRefs.current[index] = ref}
                                        style={styles.input}
                                        value={pins[index]}
                                        onChangeText={(value) => handlePinChange(index, value)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                        maxLength={1}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        textAlign="center"
                                        selectTextOnFocus
                                    />
                                );
                            })}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
    },
    groupContainer: {
        alignItems: 'center',
        gap: 8,
    },
    groupLabel: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#30363d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        color: '#f0f6fc',
        fontSize: 14,
        fontWeight: '600',
    },
    group: {
        flexDirection: 'row',
        gap: 3,
    },
    input: {
        width: 35,
        height: 45,
        borderWidth: 2,
        borderColor: '#30363d',
        borderRadius: 8,
        backgroundColor: '#21262d',
        color: '#f0f6fc',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default PinInput;