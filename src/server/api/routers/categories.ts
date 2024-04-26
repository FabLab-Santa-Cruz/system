import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  //publicProcedure,
} from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  changeParent: protectedProcedure
    .input(z.object({ id: z.string(), parentId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {

      return ctx.db.category.update({
        where: {
          id: input.id
        },
        data: {
          parentId: input.parentId
        }
      })
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        image: z.string().optional(),
        parentId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

      return ctx.db.category.upsert({
        where: {
          id: input.id ?? "X"
        },
        create: {
          name: input.name,
          image: input.image,
          parentId: input.parentId
        },
        update: {
          name: input.name,
          image: input.image,
          parentId: input.parentId

        }
      })
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),
});
