import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { connectToDB } from "../database/connectToDb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;
const db = t.middleware(async ({ next }) => {
  void (await connectToDB());
  return next();
});

const auth = t.middleware(async ({ next }) => {
  const user = await getKindeServerSession().getUser();
  return next({ ctx: { userId: user.id } });
});

export const dbProcedure = t.procedure.use(auth).use(db);
