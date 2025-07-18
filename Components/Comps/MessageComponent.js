// Components/Comps/MessageComponent.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//import { styles } from "../Utils/styles";





export default function MessageComponent({ item, user, previousMessage }) {
    const status = item.user !== user;

    // Determinar si debemos mostrar el nombre de usuario
    // Solo se muestra si es el primer mensaje del usuario o si el mensaje anterior es de otro usuario
    const shouldShowUsername = !previousMessage || previousMessage.user !== item.user;

    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
            >
                {shouldShowUsername && (
                    <Text style={status ? styles.usernameOthers : styles.usernameOwn}>
                        {item.user}
                    </Text>
                )}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {status && (
                        <Ionicons
                            name='person-circle-outline'
                            size={30}
                            color='black'
                            style={styles.mavatar}
                        />
                    )}
                    <View
                        style={
                            status
                                ? styles.mmessage
                                : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                        }
                    >
                        <Text style={status ? styles.messageTextOthers : styles.messageTextOwn}>
                            {item.text}
                        </Text>
                    </View>
                </View>
                <Text style={styles.messageTime}>{item.time}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mmessageWrapper: {
        alignItems: 'flex-start',
        marginVertical: 8,
        paddingHorizontal: 16,
    },
    mmessage: {
        backgroundColor: '#21262d',
        padding: 12,
        borderRadius: 16,
        maxWidth: '80%',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#30363d',
    },
    mavatar: {
        color: '#58a6ff',
    },
    messageTextOthers: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 20,
    },
    messageTextOwn: {
        color: '#000000',
        fontSize: 16,
        lineHeight: 20,
    },
    messageTime: {
        marginLeft: 40,
        color: '#ffffff',
        fontSize: 12,
        opacity: 0.8,
    },
    usernameOthers: {
        color: '#58a6ff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 40,
        marginBottom: 4,
    },
    usernameOwn: {
        color: '#58a6ff',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 40,
        marginBottom: 4,
        textAlign: 'right',
    },
});