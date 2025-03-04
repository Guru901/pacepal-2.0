import { createTRPCRouter, dbProcedure } from "@/server/api/trpc";
import { User } from "@/server/database/models/user-model";
import {
  OnBoardUserSchema,
  UpdateSleepSchema,
  UpdateSlotsSchema,
} from "@/lib/schema";
import { TRPCError } from "@trpc/server";
import { MongooseError } from "mongoose";

export const userRouter = createTRPCRouter({
  onboardUser: dbProcedure
    .input(OnBoardUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          email,
          picture,
          given_name,
          isOnBoarded,
          slots,
          desiredSleepHours,
          version,
        } = input;

        const user = await User.findOne({ kindeId: ctx.userId });

        if (user) {
          return { message: "User already exists", success: false };
        }

        await User.create({
          email,
          kindeId: ctx.userId,
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

  updateSlots: dbProcedure
    .input(UpdateSlotsSchema)
    .mutation(async ({ input }) => {
      try {
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

  updateSleep: dbProcedure
    .input(UpdateSleepSchema)
    .mutation(async ({ input }) => {
      try {
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
