import { ActionNotify } from "@/constants/dataBody";
import { notifySocket } from "@/libs/socket";

export interface NotificationConstructor {
  from: string // username of sender
  to: string
  action: ActionNotify
  link: string
}

export const useSendNotify = (data: NotificationConstructor) => {
  const { from, to, action, link } = data;
  console.log('send notify', data)
  notifySocket.emit('notify', { from, action, to, link });
}