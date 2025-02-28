import { GetChartsDataSchema } from "@/lib/schema";
import { createTRPCRouter, dbProcedure } from "@/server/api/trpc";
import { Form } from "@/server/database/models/form-model";
import { User } from "@/server/database/models/user-model";
import { TRPCError } from "@trpc/server";
import { MongooseError } from "mongoose";

export const chartsRouter = createTRPCRouter({
  getDistractionsData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version } = input;

        const distractionsArray: string[] = [];
        const distractions: string[] = [];

        const forms = await Form.find({
          createdBy: id,
          version,
        }).select("distractionsList createdAt");

        forms.forEach((form: { distractionsList: string }) => {
          form.distractionsList.split(",").forEach((distraction) => {
            distractionsArray.push(distraction.trim().replaceAll(" ", ""));
          });
        });

        distractionsArray.forEach((distraction) => {
          if (distraction !== "") {
            distractions.push(distraction);
          }
        });

        if (!forms.length) {
          return {
            message: "Forms not found",
            success: true,
            data: { distractions: [] },
          };
        }
        return {
          success: true,
          message: "User Found",
          data: { distractions: distractions },
        };
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

  getMoodData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version } = input;
        const forms = await Form.find({
          createdBy: id,
          version,
        }).select("mood createdAt");

        if (!forms.length) {
          return {
            message: "Forms not found",
            success: true,
            data: { forms: [] },
          };
        }
        return {
          message: "Forms found",
          success: true,
          data: { forms },
        };
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

  getOverworkData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version } = input;
        let totalOverWorkHours = 0;

        const forms = await Form.find({ version, createdBy: id });

        forms.forEach((form: { overWork: number }) => {
          totalOverWorkHours += form.overWork;
        });

        return {
          success: true,
          data: {
            overWork: totalOverWorkHours,
          },
        };
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

  getPenaltyData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version: versionName } = input;
        let penalty = 0;

        const user = await User.findById(id);

        const desiredSleepHours = user?.versions
          ?.map(
            (version: {
              versionName: string | null;
              data: { desiredSleepHours: number };
            }) => {
              if (version.versionName === versionName) {
                return version.data?.desiredSleepHours;
              }
              return null;
            },
          )
          .filter((hours: number | null) => {
            return hours !== null;
          });

        const forms = await Form.find({
          createdBy: id,
          version: versionName,
        }).select("hoursSlept");

        forms.forEach((form: { hoursSlept: number }) => {
          if (form.hoursSlept > Number(desiredSleepHours?.[0])) {
            const penaltyHrs = form.hoursSlept - Number(desiredSleepHours?.[0]);
            penalty += penaltyHrs * 100;
          }
        });

        return {
          success: true,
          data: { penalty },
        };
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

  getProductivityData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version } = input;

        const productivityData: {
          date: string;
          productivity: string;
        }[] = [];

        const forms = await Form.find({
          createdBy: id,
          version,
        })
          .select("productivity createdAt")
          .sort({
            createdAt: -1,
          })
          .limit(30);

        if (!forms.length) {
          return {
            message: "Forms not found",
            success: true,
            data: { productivityData: [] },
          };
        }

        forms.forEach((form: { productivity: string; createdAt: Date }) => {
          const date = form.createdAt.toLocaleDateString().split("/");
          const formattedDate = `${date[1]}/${date[0]}/${date[2]}`;
          productivityData.push({
            productivity: form.productivity,
            date: formattedDate,
          });
        });

        return {
          success: true,
          data: { productivityData },
        };
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

  getSleepData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version: versionFromClient } = input;
        const forms = await Form.find({
          createdBy: id,
          version: versionFromClient,
        }).select("hoursSlept createdAt");

        const user = await User.findById(id);

        const desiredSleepHours = user?.versions
          ?.map(
            (version: {
              versionName: string | null;
              data: { desiredSleepHours: number };
            }) => {
              if (version.versionName === versionFromClient) {
                return version.data?.desiredSleepHours;
              }
              return null;
            },
          )
          .filter((hours: number | null) => {
            return hours !== null;
          });

        let singleDesiredSleepingHours;

        if (desiredSleepHours) {
          singleDesiredSleepingHours =
            desiredSleepHours.length > 0 ? [desiredSleepHours[0]] : [];
        }

        if (!forms.length) {
          return {
            message: "Forms not found",
            success: true,
            data: { forms: [], desiredSleepHours: [] },
          };
        }

        return {
          success: true,
          data: { forms: forms, desiredSleepHours: singleDesiredSleepingHours },
        };
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

  getTodosData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version } = input;
        const todos = await Form.find({
          createdBy: id,
          version,
        }).select("tasksCompleted tasksPlanned createdAt");

        if (!todos.length) {
          return {
            message: "Forms not found",
            success: true,
            data: {},
          };
        }

        return {
          success: true,
          data: { todos },
        };
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

  getWorkData: dbProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      try {
        const { id, version: versionFromClient } = input;
        const forms = await Form.find({
          createdBy: id,
          version: versionFromClient,
        }).select("hoursPlanned hoursWorked createdAt");

        const user = await User.findById(id);

        const desiredWorkingHours = user?.versions
          ?.map(
            (version: {
              versionName: string;
              data: { slots: { name: string; hours: number }[] };
            }) => {
              if (version.versionName === versionFromClient) {
                return version.data.slots;
              }
              return null;
            },
          )
          .filter((slots) => {
            return slots !== null;
          });

        let singleDesiredWorkingHours;
        if (desiredWorkingHours) {
          singleDesiredWorkingHours =
            desiredWorkingHours.length > 0 ? [desiredWorkingHours[0]] : [];
        }

        if (!forms.length) {
          return {
            message: "Forms not found",
            success: true,
            data: { forms: [], desiredWorkingHours },
          };
        }

        return {
          success: true,
          data: { forms, desiredWorkingHours: singleDesiredWorkingHours },
        };
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
