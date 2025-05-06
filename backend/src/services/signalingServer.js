import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import Room from "../models/Room.js";
import User from "../models/User.js";

export function setupSignalingServer(server) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Track active rooms and participants
  const rooms = new Map();

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);
    let currentRoom = null;
    let currentUser = null;

    // Join a room
    socket.on("join-room", async ({ roomId, userId }) => {
      try {
        // Validate user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          socket.emit("error", { message: "User not found" });
          return;
        }

        // Validate room
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        currentRoom = roomId;
        currentUser = {
          id: user.clerkId,
          name: `${user.firstName} ${user.lastName}`,
          profileImage: user.profileImage,
        };

        // Join the room
        socket.join(roomId);

        // Update room participants in the database
        await Room.findByIdAndUpdate(roomId, {
          $push: {
            participants: {
              userId: user.clerkId,
              joinedAt: new Date(),
            },
          },
        });

        // Initialize room in memory if not exists
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Map());
        }

        // Add user to room
        rooms.get(roomId).set(socket.id, {
          userId: user.clerkId,
          socketId: socket.id,
          peerId: null,
          mediaState: {
            audio: true,
            video: true,
          },
        });

        // Notify other participants
        socket.to(roomId).emit("user-joined", {
          socketId: socket.id,
          user: currentUser,
        });

        // Send list of existing participants to the new user
        const participants = Array.from(rooms.get(roomId)?.entries() || []).map(
          ([id, data]) => ({
            socketId: id,
            userId: data.userId,
            mediaState: data.mediaState,
          })
        );

        socket.emit("room-users", participants);

        console.log(`User ${user.clerkId} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // WebRTC signaling
    socket.on("offer", ({ to, offer }) => {
      socket.to(to).emit("offer", {
        from: socket.id,
        offer,
      });
    });

    socket.on("answer", ({ to, answer }) => {
      socket.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      socket.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    // Media control events
    socket.on("media-state-change", ({ audio, video }) => {
      if (!currentRoom || !rooms.has(currentRoom)) return;

      const userData = rooms.get(currentRoom).get(socket.id);
      if (userData) {
        userData.mediaState = { audio, video };

        // Broadcast to all users in the room
        socket.to(currentRoom).emit("user-media-change", {
          socketId: socket.id,
          mediaState: { audio, video },
        });
      }
    });

    // Chat messages
    socket.on("send-message", (message) => {
      if (!currentRoom || !currentUser) return;

      const messageData = {
        sender: currentUser,
        text: message,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to everyone in the room including sender
      io.to(currentRoom).emit("new-message", messageData);
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      if (currentRoom && rooms.has(currentRoom)) {
        // Remove from memory
        const participants = rooms.get(currentRoom);
        participants.delete(socket.id);

        // Update room participants in the database
        if (currentUser) {
          await Room.findByIdAndUpdate(
            currentRoom,
            {
              $set: {
                "participants.$[elem].leftAt": new Date(),
              },
            },
            {
              arrayFilters: [
                {
                  "elem.userId": currentUser.id,
                  "elem.leftAt": { $exists: false },
                },
              ],
            }
          );
        }

        // Notify others
        socket.to(currentRoom).emit("user-left", {
          socketId: socket.id,
        });

        // Clean up empty rooms
        if (participants.size === 0) {
          rooms.delete(currentRoom);
          console.log(
            `Room ${currentRoom} is now empty and cleared from memory`
          );
        }
      }
    });
  });

  return io;
}
