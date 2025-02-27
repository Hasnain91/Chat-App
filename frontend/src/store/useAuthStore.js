import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checkAuth: ", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully.");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in useAuthStore in signup: ", error);
    } finally {
      set({ isSigningUp: true });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully.");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in useAuthStore in login: ", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      console.log("Axios Response for Logout: ", res);
      toast.success("Logged Out Successfully.");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in useAuthStore in logout: ", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Image Uploaded Successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error in useAuthStore in updateProfile: ", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
