// src/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"], // Optional but good for performance
});

export default socket;
