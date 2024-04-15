import { User } from "@/Components/Chat/LayoutChat";
import { notifySocket } from "@/libs/socket";
import { useEffect, useState } from "react";

export const useReceiveNotify = ({ user, accessToken }) => {
    const [usersOnline, setUserOnline] = useState<User[]>([]);
    useEffect(() => {
        notifySocket.auth = { id: user._id, username: user.username, accessToken };
        notifySocket.connect();
        notifySocket.on("users", (users) => {
            const arrayOfUsers: User[] = Object.values(users);
            setUserOnline(arrayOfUsers)
        });



        return () => {
            notifySocket.disconnect();
        }
    }, []);
    return usersOnline
}

export const useSendNotify = ({ user, accessToken }) => {

}