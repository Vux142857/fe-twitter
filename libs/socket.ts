import { io } from "socket.io-client";
const socket = io(process.env.SERVER);
export const notifySocket = io(process.env.WORKER);
export default socket;
declare module 'socket.io-client' {
  interface Socket {
    sessionID?: string
    userID?: string
    username?: string
  }
}
