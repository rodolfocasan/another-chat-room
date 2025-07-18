// Components/Comps/ChatComponent.js
import React, { useLayoutEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import RoomInfoModal from "./RoomInfoModal";
import RoomTimer from "./RoomTimer";

//import { styles } from "../Utils/styles";





const ChatComponent = ({ item, isOwner, onRoomExpire }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({});
    const [infoModalVisible, setInfoModalVisible] = useState(false);

    useLayoutEffect(() => {
        setMessages(item.messages[item.messages.length - 1]);
    }, []);

    const handleRoomPress = () => {
        navigation.navigate("Messaging", {
            id: item.id,
            name: item.name,
            isOwner: isOwner
        });
    };

    const handleInfoPress = () => {
        setInfoModalVisible(true);
    };

    const handleExpire = () => {
        if (onRoomExpire) {
            onRoomExpire(item.id);
        }
    };

    return (
        <Pressable style={styles.chatItemContainer} onPress={handleRoomPress}>
            <Ionicons
                name='person-circle-outline'
                size={45}
                color='black'
                style={styles.cavatar}
            />

            <View style={styles.chatItemContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.chatItemName}>{item.name}</Text>
                    <RoomTimer
                        createdAt={item.createdAt}
                        onExpire={handleExpire}
                    />
                </View>
                <Text style={styles.chatItemLastMessage}>
                    {item.messages?.length > 0 ?
                        item.messages[item.messages.length - 1].text :
                        "No hay mensajes aún"
                    }
                </Text>
            </View>

            {isOwner && (
                <Pressable onPress={handleInfoPress} style={styles.infoButton}>
                    <Feather name="info" size={20} color="#666" />
                </Pressable>
            )}

            <RoomInfoModal
                visible={infoModalVisible}
                setVisible={setInfoModalVisible}
                roomInfo={item}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chatItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#161b22',
        borderBottomWidth: 1,
        borderBottomColor: '#21262d',
        marginVertical: 2,
        borderRadius: 12,
        marginHorizontal: 8,
    },
    cavatar: {
        marginRight: 12,
        color: '#58a6ff',
    },
    chatItemContent: {
        flex: 1,
        paddingRight: 8,
    },
    chatItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f0f6fc',
        marginBottom: 4,
        flex: 1,
    },
    chatItemLastMessage: {
        fontSize: 14,
        color: '#8b949e',
        marginTop: 4,
    },
    infoButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#21262d',
    },
});

export default ChatComponent;