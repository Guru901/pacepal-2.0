import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { User } from "@/server/database/models/user-model";
import {
  OnBoardUserSchema,
  UpdateSleepSchema,
  UpdateSlotsSchema,
} from "@/lib/schema";

export const userRouter = createTRPCRouter({
  me: publicProcedure.input(z.string()).query(async ({ input }) => {
    const kindeId = input;

    const user = await User.findOne({ kindeId });

    if (!user) {
      return { message: "User not saved yet", success: false, data: user };
    }

    return {
      success: true,
      message: "User Found",
      data: user,
    };
  }),

  onboardUser: publicProcedure
    .input(OnBoardUserSchema)
    .mutation(async ({ input }) => {
      const {
        email,
        id,
        picture,
        given_name,
        isOnBoarded,
        slots,
        desiredSleepHours,
        version,
      } = input;

      const user = await User.findOne({ kindeId: id });

      if (user) {
        return { message: "User already exists", success: false };
      }

      await User.create({
        email,
        kindeId: id,
        picture,
        given_name,
        isOnBoarded,
        versions: [
          {
            versionName: version,
            data: {
              slots,
              desiredSleepHours,
            },
          },
        ],
      });

      return {
        message: "User Onboarded",
        success: true,
      };
    }),

  updateSlots: publicProcedure
    .input(UpdateSlotsSchema)
    .mutation(async ({ input }) => {
      const { id, slots, version } = input;

      const user = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "versions.$[elem].data.slots": slots,
          },
        },
        {
          arrayFilters: [{ "elem.versionName": version }],
          new: true,
        },
      );

      if (!user) {
        return {
          message: "User not saved yet",
          success: false,
        };
      }

      const versions = user.versions;

      return { success: true, user, data: { versions } };
    }),

  updateSleep: publicProcedure
    .input(UpdateSleepSchema)
    .mutation(async ({ input }) => {
      const { id, desiredSleepHours, version } = input;

      if (!id || !desiredSleepHours) {
        return { message: "Missing required parameters", success: false };
      }

      const user = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "versions.$[elem].data.desiredSleepHours": desiredSleepHours,
          },
        },
        {
          arrayFilters: [{ "elem.versionName": version }],
          new: true,
        },
      );

      if (!user) {
        return { message: "User not saved yet", success: false };
      }

      const versions = user.versions;

      return { success: true, user, data: { versions } };
    }),
});
