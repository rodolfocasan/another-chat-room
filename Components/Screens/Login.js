// Components/Screens/Login.js
import React, { useState, useLayoutEffect } from "react";
import {
    Text,
    SafeAreaView,
    View,
    TextInput,
    Pressable,
    Alert,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";





const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [isPressed, setIsPressed] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    // Función para guardar el nombre de usuario en AsyncStorage
    const storeUsername = async () => {
        try {
            await AsyncStorage.setItem("username", username);
            navigation.navigate("Chat");
        } catch (e) {
            Alert.alert("Error", "Error mientras se guardaba el nombre de usuario");
        }
    };

    // Manejar el inicio de sesión
    const handleSignIn = () => {
        if (username.trim()) {
            storeUsername();
        } else {
            Alert.alert("Campo requerido", "El nombre de usuario es necesario");
        }
    };

    // Verificar si ya existe un usuario guardado al cargar el componente
    useLayoutEffect(() => {
        const getUsername = async () => {
            try {
                const value = await AsyncStorage.getItem("username");
                if (value !== null) {
                    navigation.navigate("Chat");
                }
            } catch (e) {
                console.error("Error mientras se cargaba el nombre de usuario");
            }
        };
        getUsername();

        // Animaciones de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Animated.View
                    style={[
                        styles.loginscreen,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    
                    <View style={styles.headerContainer}>
                        <Text style={styles.welcomeText}>Another Chat Room</Text>
                        <Text style={styles.loginheading}>Iniciar Sesión</Text>
                        <Text style={styles.subtitleText}>
                            Ingresa tu nombre para comenzar a chatear
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.logininputContainer}>
                            <Text style={styles.inputLabel}>Nombre de Usuario</Text>
                            <TextInput
                                autoCorrect={false}
                                placeholder='Escribe tu nombre de usuario'
                                placeholderTextColor='#8b949e'
                                style={styles.logininput}
                                onChangeText={(value) => setUsername(value)}
                                value={username}
                            />
                        </View>

                        <Pressable
                            onPress={handleSignIn}
                            style={[
                                styles.loginbutton,
                                isPressed && styles.loginbuttonPressed
                            ]}
                            onPressIn={() => setIsPressed(true)}
                            onPressOut={() => setIsPressed(false)}
                        >
                            <View style={styles.buttonContent}>
                                <Text style={styles.loginbuttonText}>Empezar Chat</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                            Tu nombre se guardará de forma segura
                        </Text>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1117',
    },
    keyboardView: {
        flex: 1,
    },
    loginscreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        position: 'relative',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '300',
        color: '#8b949e',
        marginBottom: 8,
    },
    loginheading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f0f6fc',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: '#8b949e',
        textAlign: 'center',
        lineHeight: 22,
    },
    formContainer: {
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    logininputContainer: {
        width: '100%',
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#f0f6fc',
        marginBottom: 8,
        marginLeft: 4,
    },
    logininput: {
        backgroundColor: '#21262d',
        borderWidth: 1,
        borderColor: '#30363d',
        borderRadius: 12,
        padding: 18,
        fontSize: 16,
        color: '#f0f6fc',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginbutton: {
        backgroundColor: '#238636',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#238636',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        transform: [{ scale: 1 }],
    },
    loginbuttonPressed: {
        backgroundColor: '#2ea043',
        transform: [{ scale: 0.98 }],
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginbuttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footerContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#6e7681',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default Login;