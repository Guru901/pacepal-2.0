import { ScheduleSchema } from "@/lib/schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { User } from "@/server/database/models/user-model";
import mongoose, { MongooseError } from "mongoose";
import { TRPCError } from "@trpc/server";
// import { z } from "zod";

export const versionRouter = createTRPCRouter({
  add: publicProcedure.input(ScheduleSchema).mutation(async ({ input }) => {
    try {
      const safeInput = ScheduleSchema.safeParse(input);

      if (!safeInput.success) {
        throw new TRPCError({
          message: "Validation error",
          code: "BAD_REQUEST",
        });
      }

      const { desiredSleepHours, studySlots, userId, versionName } =
        safeInput.data;

      const user = await User.findById(userId);

      if (!user) {
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });
      }

      await user.versions.push({
        versionName,
        data: {
          slots: studySlots,
          desiredSleepHours,
        },
      });

      await user.save();
      return { success: true, message: "Version added" };
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new TRPCError({
          message: "Database error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add version",
      });
    }
  }),
});
