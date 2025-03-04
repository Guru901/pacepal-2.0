import { z } from "zod";
import { createTRPCRouter, dbProcedure } from "../trpc";
import { SubmitFormSchema } from "@/lib/schema";
import { Form } from "@/server/database/models/form-model";
import { TRPCError } from "@trpc/server";
import { MongooseError } from "mongoose";

export const formRouter = createTRPCRouter({
  isFormSubmitted: dbProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setUTCHours(23, 59, 59, 999);

      const form = await Form.find({
        createdBy: input,
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      });

      if (!form.length) {
        return {
          message: "Form not found",
          success: true,
          data: { isFormSubmitted: false },
        };
      }
      return {
        message: "Form submitted",
        success: true,
        data: { isFormSubmitted: true },
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
});
