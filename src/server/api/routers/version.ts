import { ScheduleSchema } from "@/lib/schema";
import { createTRPCRouter, dbProcedure } from "@/server/api/trpc";
import { User } from "@/server/database/models/user-model";
import { MongooseError } from "mongoose";
import { TRPCError } from "@trpc/server";

export const versionRouter = createTRPCRouter({
  add: dbProcedure.input(ScheduleSchema).mutation(async ({ input }) => {
    try {
      const { desiredSleepHours, studySlots, userId, versionName } = input;

      const user = await User.findById(userId);

      if (!user) {
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });
      }

      user.versions.push({
        versionName,
        data: {
          slots: studySlots,
          desiredSleepHours,
        },
      });

      await user.save();
      const versions = user.versions;

      return { success: true, message: "Version added", data: { versions } };
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new TRPCError({
          message: "Database error",
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add version",
      });
    }
  }),
});
