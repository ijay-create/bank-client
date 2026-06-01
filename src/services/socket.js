import { io } from "socket.io-client";

const socket = io("https://bank-server-blcj.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;