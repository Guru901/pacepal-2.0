import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

type UserStoreActions = {
  user: User;
  setUser: (user: UserStoreActions["user"]) => void;
};

export const useUserStore = create<UserStoreActions>()(
  persist(
    (set) => ({
      user: {
        email: "",
        id: "",
        given_name: "",
        picture: "",
        isOnBoarded: false,
        versions: [],
        mongoId: "",
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
