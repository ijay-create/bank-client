import { io } from "socket.io-client";

/* =========================
   SOCKET CONNECTION (PROD SAFE)
========================= */
const socket = io(import.meta.env.VITE_SOCKET_URL || "https://bank-server-blcj.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;