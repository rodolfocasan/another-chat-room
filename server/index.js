// server/index.js (index.js)
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Configuración de Socket.IO
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());





/*
>>> Funciones auxiliares
*/
const generateID = () => Math.random().toString(36).substring(2, 10);

const generatePIN = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pin = '';
    for (let i = 0; i < 12; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
};

const expireRoom = (roomId) => {
    const roomIndex = chatRooms.findIndex(room => room.id === roomId);
    if (roomIndex !== -1) {
        const room = chatRooms[roomIndex];
        console.log(`[!!] Expirando sala: ${room.name} (ID: ${roomId})`);

        // Notificar a todos los usuarios de la sala
        io.to(room.name).emit("roomExpired", roomId);

        // Eliminar la sala del array
        chatRooms.splice(roomIndex, 1);

        // Notificar cambios a todos los usuarios
        io.emit("roomsList", chatRooms);

        console.log(`[OK] Sala eliminada: ${room.name}`);
    }
};





// Almacenamiento de salas
let chatRooms = [];

// Eventos de Socket.IO
io.on("connection", (socket) => {
    console.log(`[OK] Usuario ${socket.id} conectado`);

    // Enviar lista de salas al conectarse
    socket.emit("roomsList", chatRooms);

    // Crear nueva sala
    socket.on("createRoom", (data) => {
        const { name, creator } = data;
        const roomId = generateID();
        const roomPin = generatePIN();

        const newRoom = {
            id: roomId,
            name,
            pin: roomPin,
            creator,
            members: [creator],
            messages: [],
            createdAt: new Date().toISOString()
        };

        socket.join(name);
        chatRooms.unshift(newRoom);

        // Programar eliminación automática después de 30 minutos
        setTimeout(() => {
            expireRoom(roomId);
        }, 30 * 60 * 1000);

        socket.emit("roomCreated", { success: true, room: newRoom });
        io.emit("roomsList", chatRooms);
    });

    // Expirar sala manualmente
    socket.on("expireRoom", (roomId) => {
        expireRoom(roomId);
    });

    // Unirse a una sala
    socket.on("joinRoom", (data) => {
        const { pin, username } = data;
        const room = chatRooms.find(r => r.pin === pin);

        if (room) {
            if (!room.members.includes(username)) {
                room.members.push(username);
            }
            socket.join(room.name);
            socket.emit("joinRoomResponse", { success: true, room });
            io.emit("roomsList", chatRooms);
        } else {
            socket.emit("joinRoomResponse", { success: false, message: "PIN incorrecto" });
        }
    });

    // Obtener salas del usuario
    socket.on("getUserRooms", (username) => {
        const myRooms = chatRooms.filter(room => room.creator === username);
        const joinedRooms = chatRooms.filter(room =>
            room.members.includes(username) && room.creator !== username
        );

        socket.emit("userRooms", { myRooms, joinedRooms });
    });

    // Buscar sala por ID
    socket.on("findRoom", (id) => {
        let result = chatRooms.filter((room) => room.id == id);
        if (result.length > 0) {
            socket.join(result[0].name);
            socket.emit("foundRoom", result[0].messages);
        }
    });

    // Enviar mensaje nuevo
    socket.on("newMessage", (data) => {
        const { room_id, message, user, timestamp } = data;
        let result = chatRooms.filter((room) => room.id == room_id);

        if (result.length > 0) {
            const newMessage = {
                id: generateID(),
                text: message,
                user,
                time: `${timestamp.hour}:${timestamp.mins}`,
            };

            console.log("Nuevo mensaje:", newMessage);

            socket.to(result[0].name).emit("roomMessage", newMessage);
            socket.emit("roomMessage", newMessage);

            result[0].messages.push(newMessage);
            io.emit("roomsList", chatRooms);
        }
    });

    // Usuario desconectado
    socket.on("disconnect", () => {
        console.log("[!!] - Usuario desconectado");
    });
});

// Verificar salas expiradas cada minuto
setInterval(() => {
    const now = new Date().getTime();
    const expiredRooms = chatRooms.filter(room => {
        const created = new Date(room.createdAt).getTime();
        const timeDiff = now - created;
        return timeDiff >= (30 * 60 * 1000); // 30 minutos
    });

    expiredRooms.forEach(room => {
        console.log(`[...] Auto-expirando sala: ${room.name}`);
        expireRoom(room.id);
    });
}, 60000); // Verificar cada minuto





// Rutas de la API
//app.get("/api", (req, res) => {
//    res.setHeader('Content-Type', 'application/json');
//    res.json(chatRooms);
//});

app.get("/api", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: "success",
        rooms: chatRooms,
        message: "Servidor funcionando correctamente"
    });
});

app.get("/ok", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json("OK");
});

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: "[OK] - Servidor de chat funcionando!" });
});





// Iniciar servidor
server.listen(PORT, () => {
    console.log(`[...] - Servidor ejecutándose en puerto ${PORT}`);
});