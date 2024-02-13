import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

export default socket;
declare module 'socket.io-client' {
    interface Socket {
      sessionID?: string
      userID?: string
      username?: string
    }
  }
  