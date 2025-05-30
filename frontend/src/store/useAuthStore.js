import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,

  checkAuth: async () => {
    try {
        const res = await axiosInstance.get("/auth/checkAuth");
        set({authUser:res.data})
        get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
    }
    finally{
        set({isCheckingAuth:false})  
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try{
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data});
      toast.success("Account created successfully!");
      get().connectSocket();
    }catch (error) {
      console.error("Error signing up:", error);
    }
    finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try{
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      get().connectSocket();
    }catch (error) {
      console.error("Error logging in:", error);
    }
    finally {
      set({ isLoggingIn: false });
    }
  },

  updatingProfile : async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query:{
        userId: authUser._id
      }
    })
    socket.connect()
    set({ socket:socket})

    socket.on("getOnlineUsers", (usersIds) =>{
      set({ onlineUsers: usersIds });
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  }
}));
