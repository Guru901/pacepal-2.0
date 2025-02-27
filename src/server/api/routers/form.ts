import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { SubmitFormSchema } from "@/lib/schema";
import { Form } from "@/server/database/models/form-model";

export const formRouter = createTRPCRouter({
  isFormSubmitted: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setUTCHours(23, 59, 59, 999);

      const form = (await Form.find({
        createdBy: input,
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })) as [];

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
    }),

  submitForm: publicProcedure
    .input(SubmitFormSchema)
    .mutation(async ({ input }) => {
      const {
        userId,
        productivity,
        hoursWorked,
        hoursPlanned,
        tasksCompleted,
        tasksPlanned,
        sleptWell,
        distractions,
        distractionsList,
        mood,
        followedSchedule,
        hoursSlept,
        version,
        overWork,
      } = input;

      const form = await Form.create({
        userId,
        productivity,
        hoursWorked,
        hoursPlanned,
        tasksCompleted,
        tasksPlanned,
        sleptWell,
        distractions,
        distractionsList,
        mood,
        followedSchedule,
        hoursSlept,
        version,
        overWork,
      });

      return { message: "Form submitted", success: true, data: form };
    }),
});
