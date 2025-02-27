import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import type { User } from "@/types/user";

export const userRouter = createTRPCRouter({
  me: publicProcedure.input(z.string()).query(async ({ input }) => {
    const kindeId = input;

    const user: User = {
      id: "",
      picture: "",
      given_name: "",
      email: "",
      isOnBoarded: false,
      versions: [],
      mongoId: "",
    };

    if (!user) {
      return { message: "User not saved yet", success: false, data: user };
    }

    return {
      success: true,
      message: "User Found",
      data: user,
    };
  }),
});
