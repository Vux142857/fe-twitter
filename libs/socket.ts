import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_SERVER);
export const notifySocket = io(process.env.NEXT_PUBLIC_WORKER);
export default socket;
declare module 'socket.io-client' {
  interface Socket {
    sessionID?: string
    userID?: string
    username?: string
  }
}
