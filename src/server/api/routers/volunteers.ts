import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  //publicProcedure,
} from "~/server/api/trpc";

export const volunteersRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      name: z.string(),
      lastname: z.string().nullable().optional(),
      emails: z.array(z.object(
        {
          email: z.string().email(),
          comment: z.string().nullable().optional()
        }
      )).optional(),
      biometricId: z.string().nullable().optional(),
      phones: z.array(z.object(
        {
          phone: z.string(),
          comment: z.string().nullable().optional()
        }
      )),
      userId: z.string().nullable().optional(),
      skills: z.array(z.string()).optional(),
      procedences: z.array(z.string()).nullable().optional(),
      birthdate: z.string().datetime().nullable().optional(),
      gender: z.string().optional(),
      image: z.string().optional()
    }))
    .mutation(async ({ctx, input }) => {
      return ctx.db.volunteers.upsert({
        where: {
          id: input.id ?? "X"
        },
        create: {
          name: input.name,
          lastname: input.lastname,
          emails: input.emails,
          biometricId: input.biometricId,
          phones: input.phones,
          userId: input.userId,
          skills: {
            connect: input.skills?.map((s) => ({ id: s }))
          },
          procedence: {
            connect: input.procedences?.map((s) => ({ id: s }))
          },
          birthdate: input.birthdate,
          genderId: input.gender,
          image: input.image
        },
        update: {
          name: input.name,
          image: input.image
        }        
      })
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.volunteers.findMany({
      include: {
        skills: true,
        procedence: true,
        gender: true,
        user: true,
        biometricPosts: true
      }
    })    
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.volunteers.delete({
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
