import { GetChartsDataSchema } from "@/lib/schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Form } from "@/server/database/models/form-model";
import { User } from "@/server/database/models/user-model";

export const chartsRouter = createTRPCRouter({
  getDistractionsData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version } = input;

      const distractionsArray: string[] = [];
      const distractions: string[] = [];

      const forms = (await Form.find({
        createdBy: id,
        version,
      }).select("distractionsList createdAt")) as [];

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
    }),

  getMoodData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version } = input;
      const forms = (await Form.find({
        createdBy: id,
        version,
      }).select("mood createdAt")) as [];

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
    }),

  getOverworkData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version } = input;
      let totalOverWorkHours = 0;

      const forms = (await Form.find({ version, createdBy: id })) as [];

      forms.forEach((form: { overWork: number }) => {
        totalOverWorkHours += form.overWork;
      });

      return {
        success: true,
        data: {
          overWork: totalOverWorkHours,
        },
      };
    }),

  getPenaltyData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
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

      const forms = (await Form.find({
        createdBy: id,
        versionName,
      }).select("hoursSlept")) as [];

      if (desiredSleepHours) {
        forms.forEach((form: { hoursSlept: number }) => {
          if (form.hoursSlept > Number(desiredSleepHours[0])) {
            const penaltyHrs = form.hoursSlept - Number(desiredSleepHours[0]);
            penalty += penaltyHrs * 100;
          }
        });
      }

      return {
        success: true,
        data: { penalty },
      };
    }),

  getProductivityData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version } = input;

      const productivityData: {
        date: string;
        productivity: string;
      }[] = [];

      const forms = (await Form.find({
        createdBy: id,
        version,
      })
        .select("productivity createdAt")
        .sort({
          createdAt: -1,
        })
        .limit(30)) as [];

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
    }),

  getSleepData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version: versionFromClient } = input;
      const forms = (await Form.find({
        createdBy: id,
        version: versionFromClient,
      }).select("hoursSlept createdAt")) as [];

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
        data: { forms, desiredSleepHours: singleDesiredSleepingHours },
      };
    }),

  getTodosData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version } = input;
      const todos = (await Form.find({
        createdBy: id,
        version,
      }).select("tasksCompleted tasksPlanned createdAt")) as [];

      if (!todos.length) {
        return {
          message: "Forms not found",
          success: true,
          data: { todos: [] },
        };
      }

      return {
        success: true,
        data: { todos },
      };
    }),

  getWorkData: publicProcedure
    .input(GetChartsDataSchema)
    .query(async ({ input }) => {
      const { id, version: versionFromClient } = input;
      const forms = (await Form.find({
        createdBy: id,
        version: versionFromClient,
      }).select("hoursPlanned hoursWorked createdAt")) as [];

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
    }),
});
