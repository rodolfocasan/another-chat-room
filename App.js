// App.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./Components/Screens/Login";
import Messaging from "./Components/Screens/Messaging";
import Chat from "./Components/Screens/Chat";

import { initializeSocket } from "./Components/Utils/socket";

const Stack = createNativeStackNavigator();





export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [serverFound, setServerFound] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const setupConnection = async () => {
			try {
				setIsLoading(true);
				setError(null);

				await initializeSocket();
				setServerFound(true);

			} catch (error) {
				console.error('Fallo al conectar con el servidor:', error);
				setError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
				setServerFound(false);
			} finally {
				setIsLoading(false);
			}
		};

		setupConnection();
	}, []);

	if (isLoading) {
		return (
			<SafeAreaProvider>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text style={styles.loadingText}>Conectando al servidor...</Text>
					<Text style={styles.loadingSubText}>Esto puede tomar unos segundos</Text>
				</View>
			</SafeAreaProvider>
		);
	}

	if (!serverFound) {
		return (
			<SafeAreaProvider>
				<View style={styles.errorContainer}>
					<Text style={styles.errorTitle}>❌ Error de conexión</Text>
					<Text style={styles.errorMessage}>{error}</Text>
					<Text style={styles.errorInstructions}>
						Pasos para resolver:
						{'\n'}1. Verifica tu conexión a internet
						{'\n'}2. Reinicia la aplicación
						{'\n'}3. Contacta al administrador si persiste
					</Text>
				</View>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: '#161b22',
						},
						headerTintColor: '#f0f6fc',
						headerTitleStyle: {
							fontWeight: 'bold',
						},
					}}
				>
					<Stack.Screen
						name='Login'
						component={Login}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='Chat'
						component={Chat}
						options={{
							title: "Chats",
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name='Messaging'
						component={Messaging}
						options={{
							headerBackTitleVisible: false,
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0d1117',
	},
	loadingText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#f0f6fc',
		marginTop: 20,
	},
	loadingSubText: {
		fontSize: 14,
		color: '#8b949e',
		marginTop: 8,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0d1117',
		padding: 20,
	},
	errorTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#f85149',
		marginBottom: 16,
	},
	errorMessage: {
		fontSize: 16,
		color: '#f0f6fc',
		textAlign: 'center',
		marginBottom: 20,
	},
	errorInstructions: {
		fontSize: 14,
		color: '#8b949e',
		textAlign: 'center',
		lineHeight: 20,
	},
});