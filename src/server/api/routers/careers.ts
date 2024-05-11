import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const careerRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return ctx.db.careers.upsert({
        where: {
          id: input.id ?? "X",
        },
        create: {
          name: input.name,
        },
        update: {
          name: input.name,
        },
      });
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.careers.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return ctx.db.careers.delete({
        where: { id: input.id },
      });
    }),
});
