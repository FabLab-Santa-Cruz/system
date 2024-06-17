import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const machinesRouter = createTRPCRouter({
  addFiles: protectedProcedure
    .input(
      z.object({
        machineId: z.string(),
        files: z.array(z.object({ url: z.string() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.volunteers.findFirst({
        select: { id: true, user_id: true },
        where: { user_id: ctx.session.user.id },
      });

      if (!id) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      const ids = await ctx.db.files.createManyAndReturn({
        data: input.files.map((file) => {
          return {
            key: file.url,
          };
        }),
      })
      return await ctx.db.machines.update({
        where: { id: input.machineId },
        data: {
          files: {
            connect: ids.map((id) => ({ id: id.id })),
          },
        },
      });
    }),

  deleteMaintenance: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.machineMaintenance.delete({
        where: { id: input.id },
      });
    }),

  createMainteneance: protectedProcedure
    .input(
      z.object({
        machineId: z.string(),
        description: z.string().nullish(),
        start_date: z.string().date(),
        end_date: z.string().date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.volunteers.findFirst({
        select: { id: true, user_id: true },
        where: { user_id: ctx.session.user.id },
      });
      if (!id) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      return await ctx.db.machineMaintenance.create({
        data: {
          description: input.description,
          machine_id: input.machineId,
          created_by_id: id.id,
          start_date: new Date(input.start_date),
          end_date: new Date(input.end_date),
        },
      });
    }),

  deleteMachine: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.volunteers.findFirst({
        select: { id: true, user_id: true },
        where: { user_id: ctx.session.user.id },
      });
      if (!id) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      return await ctx.db.machines.update({
        where: { id: input.id },
        data: {
          deleted_at: new Date(),
        },
      });
    }),
  upsertMachine: protectedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        name: z.string(),
        image: z.string().nullish(),
        description: z.string().nullish(),
        brandId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.volunteers.findFirst({
        select: { id: true, user_id: true },
        where: { user_id: ctx.session.user.id },
      });
      if (!id) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      if (input.id) {
        return await ctx.db.machines.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            image: input.image,
            brand_id: input.brandId,
            created_by_id: id.id,
          },
        });
      }

      return await ctx.db.machines.create({
        data: {
          name: input.name,
          description: input.description,
          image: input.image,
          brand_id: input.brandId,
          created_by_id: id.id,
        },
      });
    }),

  getMachines: protectedProcedure.query(({ ctx }) => {
    return ctx.db.machines.findMany({
      orderBy: { created_at: "desc" },
      include: {
        brand: true,
        files: true,
        created_by: {
          include: {
            user: {
              include: {
                person: true,
              },
            },
          },
        },
        machine_mainteneance: {
          include: {
            created_by: {
              include: {
                user: {
                  include: {
                    person: true,
                  },
                },
              },
            },
          },
        },
      },
      where: { deleted_at: null },
    });
  }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
