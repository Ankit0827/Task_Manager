// src/socket.js
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

console.log("Connecting to Socket.IO server at:", BACKEND_URL);

const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // Allow fallback to polling
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000, // 20 second timeout
});

// Add connection event listeners for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected successfully:", socket.id);
  console.log("🔗 Connected to:", BACKEND_URL);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
  console.error("🔗 Failed to connect to:", BACKEND_URL);
  console.error("📋 Error details:", {
    message: error.message,
    description: error.description,
    type: error.type,
    context: error.context
  });
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("❌ Socket reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
});

export default socket;
