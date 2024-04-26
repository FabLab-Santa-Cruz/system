import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  //publicProcedure,
} from "~/server/api/trpc";

export const brandRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      name: z.string(), image: z.string().optional()
    }))
    .mutation(async ({ctx, input }) => {
      return ctx.db.brand.upsert({
        where: {
          id: input.id ?? "X"
        },
        create: {
          name: input.name,
          image: input.image
        },
        update: {
          name: input.name,
          image: input.image
        }        
      })
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.brand.findMany()    
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.brand.delete({
        where: { id: input.id },
      })
    })

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  
});
