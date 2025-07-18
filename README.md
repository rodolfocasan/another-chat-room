![Favicon](assets/favicon.png)

# Another Chat Room
Una aplicación de chat en tiempo real para Android desarrollada con React Native, que permite crear y unirse a salas de chat temporales con funcionalidad de expiración automática.

## Tecnologías Utilizadas
- **React Native (Expo)**: Framework principal
- **React Navigation**: Navegación entre pantallas
- **Socket.IO**: Comunicación en tiempo real
- **AsyncStorage**: Almacenamiento local
- **Expo Vector Icons**: Iconografía
- **React Native Safe Area Context**: Manejo de áreas seguras

## Funcionalidades Principales
### Gestión de Salas
- **Crear Sala**: Los usuarios pueden crear salas temporales
- **Unirse a Sala**: Búsqueda y acceso a salas existentes
- **Expiración Automática**: Las salas se eliminan automáticamente
- **Información de Sala**: Detalles para propietarios

### Mensajería
- **Tiempo Real**: Mensajes instantáneos via WebSocket
- **Timestamps**: Hora de envío de cada mensaje
- **Limitación de Caracteres**: Máximo 500 caracteres por mensaje
- **Historial**: Preservación de mensajes durante la sesión

### Conexión
- **Reconexión Automática**: Manejo de pérdida de conexión
- **Cambio de Servidor**: Posibilidad de cambiar servidor sin reiniciar
- **Estados de Conexión**: Indicadores visuales del estado de conexión

## Características
- **Salas de Chat Temporales**: Crea salas que expiran automáticamente después de un tiempo determinado
- **Chat en Tiempo Real**: Mensajería instantánea utilizando WebSockets
- **Gestión de Salas**: Administra tus propias salas y únete a salas de otros usuarios
- **Configuración Flexible**: Cambia de servidor desde la aplicación
- **Notificaciones Visuales**: Indicadores de estado y temporizadores en tiempo real

## Pantallas Principales
### Login
- Autenticación de usuario
- Configuración inicial de conexión

### Chat (Pantalla Principal)
- **Mis Rooms**: Salas creadas por el usuario
- **Otros Rooms**: Salas a las que te has unido
- Botones para crear nuevas salas o unirse a existentes
- Configuración de servidor

### Messaging
- Chat en tiempo real con otros usuarios
- Visualización de mensajes con timestamps
- Contador de caracteres
- Información de sala para propietarios


## Instalación
### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git https://github.com/rodolfocasan/another-chat-room.git
   cd another-chat-room
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configuración del servidor**
   - Asegúrate de que el servidor backend esté ejecutándose
   - Configura la URL del servidor en la aplicación (se trabaja con el servidor default)

4. **Ejecuta la aplicación**
   ```bash
   npm run start
   ```




## 🐛 Resolución de Problemas
### Problemas Comunes
1. **Error de Conexión**
   - Verifica que el servidor esté ejecutándose
   - Comprueba la URL del servidor en configuración
   - Revisa la conexión a internet

2. **Mensajes no se Envían**
   - Verifica la conexión WebSocket
   - Asegúrate de estar conectado a una sala válida
   - Comprueba que la sala no haya expirado


## 🤝 Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request


## 🔗 Enlaces Relacionados
- [Documentación del Servidor](./server/README.md)
- [Expo Documentation](https://docs.expo.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)

---

**Desarrollado con ❤️ por Rodolfo Casan**