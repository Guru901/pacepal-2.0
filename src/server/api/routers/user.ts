import { createTRPCRouter, dbProcedure } from "@/server/api/trpc";
import { User } from "@/server/database/models/user-model";
import {
  OnBoardUserSchema,
  UpdateSleepSchema,
  UpdateSlotsSchema,
} from "@/lib/schema";

export const userRouter = createTRPCRouter({
  onboardUser: dbProcedure
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

  updateSlots: dbProcedure
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
          data: { versions: [] },
        };
      }

      const versions = user.versions;

      return { success: true, user, data: { versions } };
    }),

  updateSleep: dbProcedure
    .input(UpdateSleepSchema)
    .mutation(async ({ input }) => {
      const { id, desiredSleepHours, version } = input;

      if (!id || !desiredSleepHours) {
        return {
          message: "Missing required parameters",
          success: false,
          data: { versions: [] },
        };
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
        return {
          message: "User not saved yet",
          success: false,
          data: { versions: [] },
        };
      }

      const versions = user.versions;

      return { success: true, user, data: { versions } };
    }),
});
