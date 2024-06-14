import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.projectTasks.update({
        where: { id: input.id },
        data: { deleted_at: new Date() },
      });
    }),

  assignVolunteersToTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workers: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.projectTasks.update({
        where: { id: input.id },
        data: {
          assigned_to: {
            set: input.workers.map((id) => ({ id })),
          },
        },
      });
    }),

  getProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const volunteer = await ctx.db.volunteers.findFirst({
        where: { user_id: ctx.session.user.id },
      });
      if (!volunteer) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      const project = await ctx.db.projects.findFirst({
        include: {
          creator: {
            include: {
              user: {
                include: {
                  person: true,
                },
              },
            },
          },
          files: true,
          images: true,
          project_dates: {
            include: {
              tracking_date: true,
            },
          },
          workers: {
            include: {
              user: {
                include: {
                  person: true,
                },
              },
            },
          },
        },
        where: { id: input.id },
      });
      if (!project) {
        throw new TRPCClientError("No se encontro ese proyecto");
      }
      return project;
    }),

  createProjectTaskDate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        start_date: z.string().date(),
        end_date: z.string().date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const volunteer = await ctx.db.volunteers.findFirst({
        where: { user_id: ctx.session.user.id },
      });

      if (!volunteer) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      //Creates a tracking first
      const track = await ctx.db.trackingDates.create({
        data: {
          volunteer_id: volunteer.id,
          start_date: new Date(input.start_date),
          end_date: new Date(input.end_date),
        },
      });
      //All the other project dates goes to inactive
      await ctx.db.projectsTaskDates.updateMany({
        where: {
          project_task_id: input.id,
        },
        data: { active: false },
      });
      return await ctx.db.projectsTaskDates.create({
        data: {
          project_task_id: input.id,
          tracking_id: track.id,
          active: true,
        },
      });
    }),

  //   return await ctx.db.projectTasks.update({
  //     where: {
  //       id: input.id,
  //     },
  //     data: {
  //       tasks: {
  //         create: {
  //           date: input.date,
  //         },
  //       },
  //     },
  //   });
  // }),

  assignVolunteers: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        volunteers: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //Disconnect all previous connections
      // await ctx.db.projects.update({
      //   where: {
      //     id: input.id
      //   },
      //   data: {
      //     workers: {
      //       set: [],
      //     }
      //   }
      // })
      return await ctx.db.projects.update({
        where: {
          id: input.id,
        },
        data: {
          workers: {
            set: input.volunteers.map((v) => ({ id: v })),
          },
        },
      });
    }),
  getVolunteersInProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.projects.findFirst({
        select: { id: true },
        where: { id: input.id },
      });
      if (!project) {
        throw new TRPCClientError("No se encontro ese proyecto");
      }

      const volunteers = await ctx.db.volunteers.findMany({
        include: {
          user: {
            include: {
              person: true,
            },
          },
        },
        where: { projects: { some: { id: input.id } } },
      });
      return volunteers;
    }),
  createTask: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        project_id: z.string(),
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
      return await ctx.db.projectTasks.create({
        data: {
          name: input.name,
          description: input.description,
          project_id: input.project_id,
          created_by_id: id.id,
        },
      });
    }),

  getTasks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.projects.findFirst({
        select: { id: true },
        where: { id: input.id },
      });
      if (!project) {
        throw new TRPCClientError("No se encontro ese proyecto");
      }

      return await ctx.db.projectTasks.findMany({
        include: {
          project_task_dates: {
            include: {
              tracking_date: true,
            },
          },
          assigned_to: {
            include: {
              user: true,
            },
          },
          comments: {
            include: {
              volunteer: true,
            },
          },
          created_by: {
            include: {
              user: true,
            },
          }
        },
        where: {
          project_id: input.id,
          deleted_at: null,

        },
      });
    }),

  createProjectDate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        start_date: z.string().date(),
        end_date: z.string().date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const volunteer = await ctx.db.volunteers.findFirst({
        where: { user_id: ctx.session.user.id },
      });

      if (!volunteer) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      //Creates a tracking first
      const track = await ctx.db.trackingDates.create({
        data: {
          volunteer_id: volunteer.id,
          start_date: new Date(input.start_date),
          end_date: new Date(input.end_date),
        },
      });
      //All the other project dates goes to inactive
      await ctx.db.projectsDates.updateMany({
        where: { project_id: input.id },
        data: { active: false },
      });
      return await ctx.db.projectsDates.create({
        data: {
          project_id: input.id,
          tracking_id: track.id,
          active: true,
        },
      });
    }),

  restoreProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.projects.update({
        where: { id: input.id },
        data: { deleted_at: null },
      });
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.projects.update({
        where: { id: input.id },
        data: { deleted_at: new Date() },
      });
    }),
  myProjects: protectedProcedure
    .input(z.object({ deleted: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const id = await ctx.db.volunteers.findFirst({
        where: { user_id: ctx.session.user.id },
      });
      if (!id) {
        throw new TRPCClientError("No se encontro ese voluntario");
      }
      const where =
        ctx.session.user.userType === "ADMIN"
          ? {
              deleted_at: input.deleted ? null : { not: new Date() },
            }
          : {
              creator_id: id.id,
              deleted_at: input.deleted ? null : { not: new Date() },
            };

      return ctx.db.projects.findMany({
        include: {
          creator: {
            include: {
              user: {
                include: {
                  person: true,
                },
              },
            },
          },
          files: true,
          images: true,
          project_dates: {
            include: {
              tracking_date: true,
            },
          },
          workers: {
            include: {
              user: {
                include: {
                  person: true,
                },
              },
            },
          },
        },
        where,
      });
    }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
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
      return await ctx.db.projects.create({
        data: {
          name: input.name,
          creator_id: id.id,
        },
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
