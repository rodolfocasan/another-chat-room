# Another Chat Room - Backend
Back-End para la aplicación Another Chat Room, una app de chat en tiempo real que permite crear salas, unirse con PIN y enviar mensajes instantáneos.


## Tecnologías usadas
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicación en tiempo real
- **CORS** - Manejo de políticas de origen cruzado

## Endpoints
### REST API
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Estado del servidor |
| `GET` | `/api` | Lista todas las salas |
| `GET` | `/ok` | Verificación de salud |

### Socket.IO Events
#### Cliente → Servidor
| Evento | Datos | Descripción |
|--------|-------|-------------|
| `createRoom` | `{ name, creator }` | Crear nueva sala |
| `joinRoom` | `{ pin, username }` | Unirse a sala con PIN |
| `getUserRooms` | `username` | Obtener salas del usuario |
| `findRoom` | `id` | Buscar sala por ID |
| `newMessage` | `{ room_id, message, user, timestamp }` | Enviar mensaje |

#### Servidor → Cliente
| Evento | Datos | Descripción |
|--------|-------|-------------|
| `roomsList` | `Array<Room>` | Lista actualizada de salas |
| `roomCreated` | `{ success, room }` | Confirmación de sala creada |
| `joinRoomResponse` | `{ success, room/message }` | Respuesta de unión |
| `userRooms` | `{ myRooms, joinedRooms }` | Salas del usuario |
| `foundRoom` | `Array<Message>` | Mensajes de la sala |
| `roomMessage` | `Message` | Nuevo mensaje recibido |
