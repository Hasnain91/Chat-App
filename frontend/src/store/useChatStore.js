import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Flag } from "lucide-react";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  //Get All users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error in useChatStore in getUsers: ", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get message history for logged in user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error in useChatStore in getMessages : ", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send messages
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error in useChatStore in getMessages : ", error);
    }
  },

  // real-time update of messages when we open a  chat
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // Listen to newMessage event from the server
    // todo: will have some issues, optimize it later
    socket.on("newMessage", (newMessage) => {
      // const isMessageSentFromSelectedUser =
      //   newMessage.senderId !== selectedUser._id;
      // if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // unsubscribe from messages when we logout or close the window
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    // turn off the listener for newMessage event, which is coming from the server
    socket.off("newMessage");
  },

  // will have some kind of error, so will optimize later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
