import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { formRouter } from "@/server/api/routers/form";
import { versionRouter } from "@/server/api/routers/version";
import { chartsRouter } from "@/server/api/routers/charts";

export const appRouter = createTRPCRouter({
  user: userRouter,
  form: formRouter,
  version: versionRouter,
  charts: chartsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
