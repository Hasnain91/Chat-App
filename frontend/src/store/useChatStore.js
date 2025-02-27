import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Flag } from "lucide-react";

export const useChatStore = create((set) => ({
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

  // will have some kind of error, so will optimize later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
